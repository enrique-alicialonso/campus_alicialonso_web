# Firestore Database Design for Campus Alicialonso

## 1. Introduction

This document describes the design and implementation of a management system for a Performing Arts Institute. The system leverages Firebase Firestore as its primary database, handling user profiles, department structures, class schedules, and attendance tracking. This system aims to streamline administrative tasks, enhance communication, and provide a better experience for students, teachers, and managers.

## 2. Business Logic and Rationale

The core of this system is designed around these key business requirements:

* **User Management:**
  * **Centralized User Profiles:** Provide a single source of truth for user data, extending beyond Google Workspace with additional institution-specific information.
  * **Historical Data Preservation:** Retain user data (including suspended or deleted users) for historical reference and reporting.
  * **Role-Based Access:** Manage access to the application based on user roles (student, teacher, manager).
* **Department Management:**
  * **Organizational Structure:** Define departments with their titles, descriptions, and managers.
  * **Dynamic Group Management:** Allow departments to manage and archive student groups per academic year, accommodating for specific project needs (drama casts, performances, etc.)
  * **Google Workspace Integration:** Synchronize department memberships (and its user groups) to align with Google Groups where needed, for easy user management in other platforms.
* **Schedule Management:**
  * **Academic Period Specific:** Create and store schedules per academic period (Fall, Spring, etc.).
  * **Event Management:** Define individual events within schedules, with specific times, locations, and participating groups.
  * **Historical Tracking:** Preserve schedules for historical reference and activity tracking.
* **Attendance Tracking:**
  * **Flexible Attendance Taking:** Enable teachers to record attendance for courses, with support for multiple teachers per class and dynamic student groups.
  * **Accurate Record Keeping:** Track attendance accurately at a group, event, and class level for students.
  * **Overall Attendance Reporting:** Easily aggregate and calculate attendance metrics for courses, groups and individual students.

### Core Business Rules

* ***Users**
  * *Users cannot be deleted, only suspended
  * *Each user belongs to one department
  * *Users can belong to multiple groups within their department
  * *Historical data is preserved for reporting

* ***Departments**
  * *Each department can have multiple managers
  * *Departments manage groups per academic year
  * *Department data syncs with Google Groups

* ***Groups**
  * *Groups are academic-year specific
  * *Groups can be archived but not deleted
  * *Groups track student membership history

* ***Schedules & Events**
  * *Schedules are department and period-specific
  * *Events can have multiple participant groups
  * *Events track location and attendance

* ***Attendance**
  * *Records are immutable once created
  * *Only teachers assigned to a course can record attendance
  * *Multiple teachers can manage the same course
  * *Attendance is tracked at group level

## 3. Rationale Behind the Approach

* **Firebase Firestore:** Chosen for its scalability, real-time capabilities, and flexibility (NoSQL data model).
* **NoSQL Data Structure:** Prioritizes data access patterns and avoids complex joins (denormalization).
* **Cloud Functions:** Automate synchronization and background tasks between Google Workspace and Firestore.
* **Clear Data Structure:** Designed for maintainability and readability for all developers involved.
* **Security:** Designed with security rules to protect data from unauthorized access and modifications.

## 4. Database Model

This section details the structure of your Firestore database, including collections, documents, and their respective fields:

* **`users` Collection:**
  * **Document ID:** Firebase Auth UID.
  * **Fields:**
    * `email` (String): User's email address (for historical reference).
    * `displayName` (String): User's display name.
    * `photoURL` (String, optional): User's profile picture URL.
    * `department` (String, optional): ID of the department user belongs to.
    * `role` (String, optional): 'student', 'teacher', or 'manager'.
    * `created` (Timestamp): When the user was added to Firestore.
    * `lastLogin` (Timestamp): Last login time.
    * `status` (String): 'active', 'suspended', or 'deleted'.
    * `groups` (Array of String, optional): Array of group IDs from the current academic year the student belongs to.
    * `additionalData` (Map, optional): Other institution-specific data.

* **`departments` Collection:**
  * **Document ID:** Auto-generated ID or a unique short code.
  * **Fields:**
    * `title` (String): Department name.
    * `description` (String): Department description.
    * `managers` (Array of String): UIDs of department managers.
    * `currentGroup` (String, optional): ID of the current group in the current academic period.
    * `googleGroupId` (String, optional): ID of the department's Google Group

  * **Subcollection:** `groups`
    * **Document ID:** Auto-generated ID.
    * **Fields:**
      * `academicYear` (String): e.g., "2023-2024".
      * `groupName` (String): The name of the group for that specific period.
      * `members` (Array of Strings): User UIDs of group members.
      * `created` (Timestamp): When the group was created.
      * `archived` (Boolean): Is this an active or archived group?

* **`schedules` Collection:**
  * **Document ID:** Auto-generated ID.
  * **Fields:**
    * `academicPeriod` (String): Unique identifier for the academic period (e.g., "Fall 2023").
    * `departmentId` (String): ID of the department the schedule belongs to.
    * `startDate` (Timestamp): Period start date.
    * `endDate` (Timestamp): Period end date.
    * `created` (Timestamp): When the schedule was created.
    * `archived` (Boolean): Is this an active or archived schedule?

  * **Subcollection:** `events`
    * **Document ID:** Auto-generated ID.
    * **Fields:**
      * `title` (String): Event title.
      * `description` (String): Event description.
      * `startTime` (Timestamp): Event start time.
      * `endTime` (Timestamp): Event end time.
      * `participants` (Array of Strings): Array of user UIDs or group IDs.
      * `location` (String, optional): Event location.
      * `color` (String, optional): Color to display the event in the app.
      * `created` (Timestamp): When the event was created.

* **`courses` Collection:**
  * **Document ID:** Auto-generated ID.
  * **Fields:**
    * `name` (String): Class title.
    * `description` (String, optional): Class description.
    * `color` (String): Color to represent the class in the app.
    * `imageUrl` (String, optional): Image URL (Firebase Storage).
    * `teachers` (Array of Strings): List of teacher UIDs that are teaching the class.
    * `academicYear` (String): The academic year this class applies to.

* **`attendanceRecords` Collection:**
  * **Document ID:** Auto-generated ID or `scheduleId_eventId` composite ID.
  * **Fields:**
    * `classId` (String): ID of the class.
    * `scheduleId` (String): ID of the Schedule.
    * `eventId` (String): ID of the event.
    * `groupId` (String): ID of the group that was being attended.
    * `attendanceTime` (Timestamp): Time when attendance was taken.
    * `teacherUid` (String): UID of the teacher that took the attendance.
    * `attendances` (Map of String to String): Key is student UID, value is attendance status ("present", "absent", "late").
    * `notes` (Map of String to String, Optional): Key is student UID, value is notes for that student.
    * `created` (Timestamp): When the attendance record was created.

## 5. Firestore Security Rules

These rules enforce security by controlling access to data based on user roles and relationships. They are defined in the Firestore Security Rules console in Firebase and enforce:

* **User Collection:**
  * Users can only read and update their own profiles, and can only create users if the uid and email match.
  * User deletion is not allowed.

* **Departments Collection:**
  * Public read access.
  * Only department managers can update department data.
  * Creation or deletion of a department is not allowed through the client side.

* **Groups Subcollection:**
  * Public read access.
  * Only department managers of the corresponding department can create and update group data.
  * Group deletion is not allowed.

* **Schedules Collection:**
  * Public read access.
  * Only department managers can create, or update schedules.
  * Schedule deletion is not allowed.

* **Events Subcollection:**
  * Public read access.
  * Only department managers can manage events.
  * Event deletion is not allowed.

* **Courses Collection:**
  * Public read access.
  * Only managers can create or update a class.
  * Class deletion is forbidden.

* **AttendanceRecords Collection:**
  * Public read access.
  * Only teachers of a class can create new attendance records.
  * Updates and deletes to attendance records are not allowed.

## 6. Data Synchronization and Automation

* **Cloud Functions:**
  * **User Sync:** Cloud functions are triggered when users are created or updated in Firebase Auth, updating their profiles in Firestore with data from Google Workspace (Directory API).
  * **Department Sync:** Cloud functions are triggered manually or via a scheduler to keep departments in sync with Google Workspace Groups (Groups API).
  * **Classroom Sync:** Cloud functions are used to sync courses created or updated in Google Classroom with the courses data in the Firestore database.

* **Cloud Scheduler:**
  * Schedules Cloud Functions to run periodically for ongoing synchronization with Google Workspace.

## 7. Usage and Behavior

* **Users (Students):**
  * Can view their profile.
  * Can view their courses, groups, and schedules.
  * Can view their individual attendance record.
* **Users (Teachers):**
  * Can view their own courses.
  * Can take attendance for courses.
  * Can view and manage class groups.
* **Users (Managers):**
  * Can manage department settings (description, managers).
  * Can manage groups for their corresponding departments.
  * Can create and edit courses, schedules and events.
* **General Behavior:**
  * The mobile app integrates with Google Workspace to present the user with the available data.
  * Data modifications (attendance records) are stored in Firestore, and is available in realtime (if needed) for the clients.

## 8. Technology Stack

* **Backend:** Firebase Firestore, Firebase Cloud Functions, Firebase Auth, Google Workspace APIs
* **Frontend:** React Native (but any framework can be used)
* **Testing:** Jest, `@firebase/rules-unit-testing`
* **Language:** TypeScript

## 9. Future Considerations

* **Advanced Reporting:** Build more sophisticated attendance and activity reporting features.
* **Notifications:** Implement notification systems for schedule changes and updates.
* **Integration with Other Systems:** Further integrations with other institutional systems.

## 10. Conclusion

This management system is designed to improve the administrative tasks at the Alicia Alonso Institute of Dance by providing a robust database solution for user management, schedule management, and attendance tracking, while keeping a high degree of data integrity, security, and consistency.

This document should help all involved (students, teachers, managers, and developers) understand how the system works, how the data is stored, and how to use the provided tools and services. If you have any other questions or need additional clarification, please don't hesitate to ask.
