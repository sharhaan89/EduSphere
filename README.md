# EduSphere

EduSphere is a centralized platform for students to share notes, study materials, and clarify doubts through an interactive discussion forum. It allows users to upload subject-wise categorized resources, track updated versions, and engage in academic discussions. The portal fosters collaborative learning by enabling students to ask and answer questions, share insights, and access high-quality study materials, making it easier to stay organized and excel in academics.

# Running the website:

**Backend**

```
cd backend
npm install
npm run dev
```

**Frontend**

```
cd frontend
npm install
npm run dev
```

# Routes

**User Routes:** <br>
POST /user/login - Login to the website with email/username and password credentials.<br>
POST /user/register - Register an account on the website with multiple details. <br>

**Thread Routes:** <br>
GET /forum/thread/:subforum/all - Retrieve all the threads created under the subforum. <br>
GET /forum/thread/:id - Retrieve the thread with the thread id. <br>
POST /forum/thread/:subforum - Create a thread under the subforum with title and content. <br>
PUT /forum/thread/:id - Edit a thread with updated title and/or content. <br>
DELETE /forum/thread/:id - Delete a thread. <br>

**Reply Routes:** <br>
GET /forum/reply/:threadid - Retrieve all the replies made under some thread with the thread id. <br>
POST /forum/reply/thread/:threadid - Create a reply to the thread with the thread id. <br>
PUT /forum/reply/:replyid - Edit a reply. <br>
DELETE /forum/reply/:replyid - Delete a reply. <br>

**Vote Routes:** <br>
GET /forum/vote/:contentType/:contentId - Retrieve the net votes of a thread or reply using the id. <br>
POST /forum/vote - Cast a positive or negative vote for a thread or reply. <br>
