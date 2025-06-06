-- First, let's check the available users and courses
SELECT TOP 5 Id, Email, UserName FROM [EduSyncDB].[dbo].[AspNetUsers];
SELECT TOP 5 CourseId, Title, InstructorId FROM [EduSyncDB].[dbo].[Courses];

-- Now, let's create some test enrollments
-- Replace the UserId and CourseId with actual IDs from the above queries
-- Here's an example (uncomment and modify as needed):

/*
-- Example 1: Enroll a user in a course
INSERT INTO [EduSyncDB].[dbo].[Enrollments] (EnrollmentId, UserId, CourseId, EnrollmentDate)
VALUES (
    NEWID(), -- This will generate a new GUID for the enrollment
    'YOUR_USER_ID_HERE', -- Replace with actual user ID
    'YOUR_COURSE_ID_HERE', -- Replace with actual course ID
    GETDATE() -- Current date and time
);

-- Example 2: Enroll the same user in another course
INSERT INTO [EduSyncDB].[dbo].[Enrollments] (EnrollmentId, UserId, CourseId, EnrollmentDate)
VALUES (
    NEWID(),
    'SAME_USER_ID_AS_ABOVE', -- Same user ID as above
    'ANOTHER_COURSE_ID_HERE', -- Different course ID
    DATEADD(day, -7, GETDATE()) -- 7 days ago
);

-- Example 3: Enroll another user in a course
INSERT INTO [EduSyncDB].[dbo].[Enrollments] (EnrollmentId, UserId, CourseId, EnrollmentDate)
VALUES (
    NEWID(),
    'ANOTHER_USER_ID_HERE', -- Different user ID
    'YOUR_COURSE_ID_HERE', -- Same or different course ID
    DATEADD(day, -14, GETDATE()) -- 14 days ago
);
*/

-- After running the inserts, verify the enrollments
SELECT TOP 10 e.EnrollmentId, e.UserId, u.Email, e.CourseId, c.Title, e.EnrollmentDate
FROM [EduSyncDB].[dbo].[Enrollments] e
LEFT JOIN [EduSyncDB].[dbo].[AspNetUsers] u ON e.UserId = u.Id
LEFT JOIN [EduSyncDB].[dbo].[Courses] c ON e.CourseId = c.CourseId
ORDER BY e.EnrollmentDate DESC;
