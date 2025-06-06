# Script to check database for enrollments
$connectionString = "Server=DESKTOP-SHDT8DR;Database=EduSyncDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

# Function to execute SQL query
function Execute-SqlQuery($query) {
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $command = New-Object System.Data.SqlClient.SqlCommand($query, $connection)
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)
    $dataset = New-Object System.Data.DataSet
    
    try {
        $connection.Open()
        $adapter.Fill($dataset) | Out-Null
        return $dataset.Tables[0]
    }
    catch {
        Write-Host "Error executing query: $_" -ForegroundColor Red
        return $null
    }
    finally {
        $connection.Close()
    }
}

# Check users
Write-Host "=== Users ===" -ForegroundColor Green
$users = Execute-SqlQuery "SELECT TOP 5 Id, Email, UserName FROM AspNetUsers"
$users | Format-Table -AutoSize

# Check courses
Write-Host "`n=== Courses ===" -ForegroundColor Green
$courses = Execute-SqlQuery "SELECT TOP 5 CourseId, Title, InstructorId FROM Courses"
$courses | Format-Table -AutoSize

# Check enrollments
Write-Host "`n=== Enrollments ===" -ForegroundColor Green
$enrollments = Execute-SqlQuery @"
    SELECT TOP 10 e.EnrollmentId, e.UserId, u.Email, e.CourseId, c.Title, e.EnrollmentDate
    FROM Enrollments e
    LEFT JOIN AspNetUsers u ON e.UserId = u.Id
    LEFT JOIN Courses c ON e.CourseId = c.CourseId
    ORDER BY e.EnrollmentDate DESC
"@

if ($enrollments -and $enrollments.Rows.Count -gt 0) {
    $enrollments | Format-Table -AutoSize
} else {
    Write-Host "No enrollments found in the database." -ForegroundColor Yellow
}

# Check if there are any enrollments at all
$enrollmentCount = Execute-SqlQuery "SELECT COUNT(*) as TotalEnrollments FROM Enrollments"
Write-Host "`nTotal number of enrollments: $($enrollmentCount.TotalEnrollments)" -ForegroundColor Cyan
