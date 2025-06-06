# Database connection parameters
$server = "DESKTOP-SHDT8DR"
$database = "EduSyncDB"
$connectionString = "Server=$server;Database=$database;Trusted_Connection=True;TrustServerCertificate=True;"

# Function to execute SQL query and return results
function Invoke-SqlQuery {
    param(
        [string]$query
    )
    
    try {
        $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
        $command = New-Object System.Data.SqlClient.SqlCommand($query, $connection)
        $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)
        $dataset = New-Object System.Data.DataSet
        
        $connection.Open()
        $adapter.Fill($dataset) | Out-Null
        
        return $dataset.Tables[0]
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

# Query to get users
Write-Host "`n=== USERS ===" -ForegroundColor Green
$usersQuery = @"
SELECT TOP 5 
    Id AS UserId, 
    Email, 
    UserName
FROM AspNetUsers
"@

$users = Invoke-SqlQuery -query $usersQuery
if ($users) {
    $users | Format-Table -AutoSize
} else {
    Write-Host "No users found or error accessing users table." -ForegroundColor Yellow
}

# Query to get courses
Write-Host "`n=== COURSES ===" -ForegroundColor Green
$coursesQuery = @"
SELECT TOP 5 
    CourseId, 
    Title, 
    InstructorId
FROM Courses
"@

$courses = Invoke-SqlQuery -query $coursesQuery
if ($courses) {
    $courses | Format-Table -AutoSize
} else {
    Write-Host "No courses found or error accessing courses table." -ForegroundColor Yellow
}

# Query to get enrollments
Write-Host "`n=== ENROLLMENTS ===" -ForegroundColor Green
$enrollmentsQuery = @"
SELECT TOP 5
    e.EnrollmentId,
    e.UserId,
    u.Email AS UserEmail,
    e.CourseId,
    c.Title AS CourseTitle,
    e.EnrollmentDate
FROM Enrollments e
LEFT JOIN AspNetUsers u ON e.UserId = u.Id
LEFT JOIN Courses c ON e.CourseId = c.CourseId
ORDER BY e.EnrollmentDate DESC
"@

$enrollments = Invoke-SqlQuery -query $enrollmentsQuery
if ($enrollments -and $enrollments.Rows.Count -gt 0) {
    $enrollments | Format-Table -AutoSize
} else {
    Write-Host "No enrollments found in the database." -ForegroundColor Yellow
}

# Get total counts
Write-Host "`n=== DATABASE COUNTS ===" -ForegroundColor Cyan
$countsQuery = @"
SELECT 
    (SELECT COUNT(*) FROM AspNetUsers) AS TotalUsers,
    (SELECT COUNT(*) FROM Courses) AS TotalCourses,
    (SELECT COUNT(*) FROM Enrollments) AS TotalEnrollments
"@

$counts = Invoke-SqlQuery -query $countsQuery
if ($counts) {
    $counts | Format-Table -AutoSize
}

Write-Host "`nTo create test enrollments, you'll need to:"
Write-Host "1. Note a valid UserId from the USERS section"
Write-Host "2. Note a valid CourseId from the COURSES section"
Write-Host "3. Use these IDs to create enrollments using the CreateTestEnrollments.sql script" -ForegroundColor Yellow
