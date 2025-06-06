-- Check users in the database
SELECT TOP 10 
    Id AS UserId, 
    Email, 
    UserName,
    'User' AS UserType
FROM [EduSyncDB].[dbo].[AspNetUsers]

UNION ALL

-- Check instructors (assuming they're in the same table with a role)
SELECT 
    u.Id AS UserId,
    u.Email,
    u.UserName,
    'Instructor' AS UserType
FROM [EduSyncDB].[dbo].[AspNetUsers] u
JOIN [EduSyncDB].[dbo].[AspNetUserRoles] ur ON u.Id = ur.UserId
JOIN [EduSyncDB].[dbo].[AspNetRoles] r ON ur.RoleId = r.Id
WHERE r.Name = 'Instructor'

-- Check available courses
SELECT TOP 10 
    CourseId, 
    Title, 
    Description,
    InstructorId
FROM [EduSyncDB].[dbo].[Courses]

-- Check existing enrollments (if any)
SELECT TOP 10 
    e.EnrollmentId, 
    e.UserId, 
    u.Email AS UserEmail,
    e.CourseId, 
    c.Title AS CourseTitle, 
    e.EnrollmentDate
FROM [EduSyncDB].[dbo].[Enrollments] e
LEFT JOIN [EduSyncDB].[dbo].[AspNetUsers] u ON e.UserId = u.Id
LEFT JOIN [EduSyncDB].[dbo].[Courses] c ON e.CourseId = c.CourseId
ORDER BY e.EnrollmentDate DESC;
