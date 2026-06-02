# Why I Chose This Stack

For the frontend, I chose **React** because its component-based model and state synchronization make building dynamic, interactive dashboards highly efficient. It allowed me to manage live capacity progress bars and registration statuses seamlessly without manual DOM updates.

On the backend, **Express.js** was selected because it is lightweight and provides a minimalist framework for Node.js. It made defining REST routes and mounting auth middlewares extremely fast, keeping the server code maintainable and simple.

For data storage, I chose **MySQL** because the relationship between events and registrations is strictly relational. One event has many registrations, and MySQL guarantees relational integrity via foreign key constraints. This was crucial for enforcing cascade deletes and registration uniqueness checks.

Finally, **JWT** (JSON Web Tokens) was selected for authentication. Because the project specification supplied a predefined set of user credentials (with no signup requirements or database-driven user table), stateless JWT authorization allowed me to securely sign sessions, encode user roles, and protect dashboard routes on the client side without needing database roundtrips for session checks.

# One Decision I Made That Wasn't Specified In The Brief

While the brief required administrators to create and monitor events, it did not explicitly request the ability to update or delete events. 

I chose to implement full event editing and deletion functionalities on the backend and frontend. In a real-world campus portal, event parameters like venue capacity or dates change frequently. Allowing administrators to modify event details or correct mistakes directly through the UI makes the system far more practical and complete.

To ensure safety and security:
- I integrated confirmation warning modals before delete operations to prevent accidental data loss.
- I enforced role-based access control guards on both the routing and database levels, ensuring only authenticated administrators can invoke these PUT and DELETE operations.
- The delete controller automatically cleans up associated registrations first, preventing database foreign key constraint violations.

# One Thing I Would Improve With More Time

Given more time, I would implement **Event Search and Filtering** on the Student Dashboard. 

Currently, students browse all upcoming events sorted by date in a single view. As the number of campus events grows, this list will become less readable. Introducing search queries (filtering by name or venue) and category tags (e.g., *Workshop, Hackathon, Cultural*) would significantly improve usability, allowing students to instantly find events of interest. This would keep the portal performant and easy to navigate even under heavy event configurations.