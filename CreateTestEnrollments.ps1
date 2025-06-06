# Database connection parameters
$server = "DESKTOP-SHDT8DR"
$database = "EduSyncDB"
$connectionString = "Server=$server;Database=$database;Trusted_Connection=True;TrustServerCertificate=True;"

# Function to execute SQL query
function Invoke-SqlCommand {
    param(
        [string]$query
    )
    
    try {
        $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
        $command = New-Object System.Data.SqlClient.SqlCommand($query, $connection)
        $connection.Open()
        $result = $command.ExecuteNonQuery()
        return $result
    }
    catch {
        Write-Host "Error executing query: $_" -ForegroundColor Red
        return $null
    }
    finally {
        if ($connection.State -eq [System.Data.ConnectionState]::Open) {
            $connection.Close()
        }
    }
}

# Function to get scalar value from query
function Get-SqlScalar {
    param(
        [string]$query
    )
    
    try {
        $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
        $command = New-Object System.Data.SqlClient.SqlCommand($query, $connection)
        $connection.Open()
        $result = $command.ExecuteScalar()
        return $result
    }
    catch {
        Write-Host "Error executing query: $_" -ForegroundColor Red
        return $null
    }
    finally {
        if ($connection.State -eq [System.Data.ConnectionState]::Open) {
            $connection.Close()
        }
    }
}

# Get a valid user ID (try different approaches)
Write-Host "`nGetting a valid user ID..." -ForegroundColor Cyan
$userId = Get-SqlScalar -query "SELECT TOP 1 Id FROM AspNetUsers"

if (-not $userId) {
    # If we can't get a user ID, try to find one from the enrollments table
    $userId = Get-SqlScalar -query "SELECT TOP 1 UserId FROM Enrollments"
    
    if (-not $userId) {
        # If still no user ID, we'll need to create a test user
        Write-Host "No users found. Please create a test user first." -ForegroundColor Red
        exit
    }
}

Write-Host "Using User ID: $userId" -ForegroundColor Green

# Get available courses
Write-Host "`nAvailable Courses:" -ForegroundColor Cyan
$courses = @(
    @{ CourseId = "a8b6cabc-5b94-4838-a935-7a34a429269f"; Title = "HTML First" },
    @{ CourseId = "7385aa21-7f74-4b8b-a43f-a6b626128145"; Title = "jwdajdwja" },
    @{ CourseId = "d7fa737c-71eb-4f1f-a200-bd826b6369cf"; Title = "jwda" },
    @{ CourseId = "14719d16-32b9-42e8-8882-db14a14c1fcf"; Title = "Python" },
    @{ CourseId = "edac5f58-ceab-4015-afbe-ea4e76b9ef0d"; Title = "SHakr" }
)

$courses | Format-Table -AutoSize

# Create enrollments
Write-Host "`nCreating test enrollments..." -ForegroundColor Cyan
$enrollmentCount = 0

foreach ($course in $courses) {
    $enrollmentId = [guid]::NewGuid().ToString()
    $courseId = $course.CourseId
    $enrollmentDate = (Get-Date).AddDays(-(Get-Random -Minimum 1 -Maximum 30)).ToString("yyyy-MM-dd HH:mm:ss")
    
    $query = @"
    IF NOT EXISTS (SELECT 1 FROM Enrollments WHERE UserId = '$userId' AND CourseId = '$courseId')
    BEGIN
        INSERT INTO Enrollments (EnrollmentId, UserId, CourseId, EnrollmentDate)
        VALUES ('$enrollmentId', '$userId', '$courseId', '$enrollmentDate')
        SELECT 'Enrollment created for course: $($course.Title)' AS Result
    END
    ELSE
    BEGIN
        SELECT 'Enrollment already exists for course: $($course.Title)' AS Result
    END
"@
    
    $result = Get-SqlScalar -query $query
    if ($result -like "Enrollment created*") {
        $enrollmentCount++
    }
    Write-Host "- $result"
}

# Verify enrollments
Write-Host "`nVerifying enrollments..." -ForegroundColor Cyan
$enrollmentsQuery = @"
SELECT 
    e.EnrollmentId,
    e.UserId,
    c.Title AS CourseTitle,
    e.EnrollmentDate
FROM Enrollments e
JOIN Courses c ON e.CourseId = c.CourseId
WHERE e.UserId = '$userId'
ORDER BY e.EnrollmentDate DESC
"@

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $command = New-Object System.Data.SqlClient.SqlCommand($enrollmentsQuery, $connection)
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)
    $dataset = New-Object System.Data.DataSet
    
    $connection.Open()
    $adapter.Fill($dataset) | Out-Null
    
    $enrollments = $dataset.Tables[0]
    
    if ($enrollments.Rows.Count -gt 0) {
        Write-Host "`nSuccess! $($enrollments.Rows.Count) enrollments found:" -ForegroundColor Green
        $enrollments | Format-Table -AutoSize -Property @{Name="Course";Expression={$_.CourseTitle}}, @{Name="Enrolled On";Expression={$_.EnrollmentDate}}
    } else {
        Write-Host "No enrollments found for user $userId" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Error verifying enrollments: $_" -ForegroundColor Red
}
finally {
    if ($connection.State -eq [System.Data.ConnectionState]::Open) {
        $connection.Close()
    }
}

Write-Host "`nScript completed. $enrollmentCount new enrollments were created." -ForegroundColor Cyan
