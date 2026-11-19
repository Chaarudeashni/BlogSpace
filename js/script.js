
// HOME PAGE SEARCH
const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        let search = this.value.toLowerCase();

        document.querySelectorAll(".blog-card").forEach(card => {
            let title = card.querySelector("h3").textContent.toLowerCase();
            let description = card.querySelector("p").textContent.toLowerCase();

            card.style.display =
                title.includes(search) || description.includes(search)
                ? "block" : "none";
        });
    });
}



// LOGIN FORM - BACKEND API CONNECTION

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        let email = document.getElementById("loginEmail").value.trim();
        let password = document.getElementById("loginPassword").value;
        let message = document.getElementById("loginMessage");

        if (email === "" || password === "") {
            message.textContent = "Please fill all fields.";
            message.style.color = "red";
            return;
        }

        try {

            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {

                message.textContent = data.message;
                message.style.color = "green";

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(data.user)
                );

                setTimeout(function () {
                    window.location.href = "dashboard.html";
                }, 1000);

            } else {

                message.textContent = data.message;
                message.style.color = "red";

            }

        } catch (error) {

            message.textContent = "Unable to connect to the server.";
            message.style.color = "red";

        }

    });

}



// REGISTRATION FORM - BACKEND API CONNECTION

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        let name = document.getElementById("regName").value.trim();
        let email = document.getElementById("regEmail").value.trim();
        let password = document.getElementById("regPassword").value;
        let confirmPassword = document.getElementById("confirmPassword").value;
        let message = document.getElementById("registerMessage");

        if (!name || !email || !password || !confirmPassword) {
            message.textContent = "Please fill all fields.";
            message.style.color = "red";
            return;
        }

        if (password.length < 6) {
            message.textContent = "Password must contain at least 6 characters.";
            message.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            message.style.color = "red";
            return;
        }

        try {

            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {

                message.textContent = data.message;
                message.style.color = "green";

                registerForm.reset();

            } else {

                message.textContent = data.message;
                message.style.color = "red";

            }

        } catch (error) {

            message.textContent = "Unable to connect to the server.";
            message.style.color = "red";

        }

    });

}




 // DASHBOARD FUNCTIONALITY - BACKEND API CONNECTION

const dashboardBlogs = document.getElementById("dashboardBlogs");

if (dashboardBlogs) {

    async function displayDashboardBlogs() {

        const currentUser = JSON.parse(
            localStorage.getItem("currentUser")
        );

        try {

            const response = await fetch("http://localhost:5000/api/blogs");
            const data = await response.json();

            if (!response.ok) {
                throw new Error("Unable to fetch blogs");
            }

            const blogs = data.blogs || [];

            const myBlogs = currentUser
                ? blogs.filter(blog => blog.author === currentUser.name)
                : [];

            document.getElementById("totalPosts").textContent = myBlogs.length;

            dashboardBlogs.innerHTML = "";

            if (myBlogs.length === 0) {
                dashboardBlogs.innerHTML =
                    "<p>No blog posts available. Create your first blog!</p>";
                return;
            }

            myBlogs.forEach((blog) => {

                let card = document.createElement("div");
                card.className = "blog-card";

                let title = document.createElement("h3");
                title.textContent = blog.title;

                let category = document.createElement("p");
                category.textContent = "Category: " + blog.category;

                let description = document.createElement("p");
                description.textContent = blog.content;

                let date = document.createElement("p");
                date.textContent = "Published: " +
                    new Date(blog.createdAt).toLocaleDateString();

                let deleteButton = document.createElement("button");
                deleteButton.className = "btn";
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", async function () {

                    if (!confirm("Are you sure you want to delete this blog?")) {
                        return;
                    }

                    try {

                        const deleteResponse = await fetch(
                            `http://localhost:5000/api/blogs/${blog.id}`,
                            {
                                method: "DELETE"
                            }
                        );

                        const deleteData = await deleteResponse.json();

                        if (deleteResponse.ok) {
                            alert(deleteData.message);
                            displayDashboardBlogs();
                        } else {
                            alert(deleteData.message);
                        }

                    } catch (error) {
                        alert("Unable to delete blog.");
                    }

                });

                card.appendChild(title);
                card.appendChild(category);
                card.appendChild(description);
                card.appendChild(date);
                card.appendChild(deleteButton);

                dashboardBlogs.appendChild(card);

            });

        } catch (error) {

            dashboardBlogs.innerHTML =
                "<p>Unable to load blogs. Please check the backend server.</p>";

        }
    }

    displayDashboardBlogs();

}



// CREATE BLOG FORM - BACKEND API CONNECTION

const blogForm = document.getElementById("blogForm");

if (blogForm) {

    blogForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const title = document.getElementById("blogTitle").value.trim();
        const category = document.getElementById("blogCategory").value;
        const content = document.getElementById("blogContent").value.trim();
        const message = document.getElementById("blogMessage");

        const currentUser = JSON.parse(
            localStorage.getItem("currentUser")
        );

        if (!currentUser) {
            message.textContent = "Please login first.";
            message.style.color = "red";
            return;
        }

        try {

            const response = await fetch("http://localhost:5000/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    category: category,
                    content: content,
                    author: currentUser.name
                })
            });

            const data = await response.json();

            if (response.ok) {

                message.textContent = data.message;
                message.style.color = "green";

                blogForm.reset();

            } else {

                message.textContent = data.message;
                message.style.color = "red";

            }

        } catch (error) {

            message.textContent = "Unable to connect to the server.";
            message.style.color = "red";

        }

    });

}


// DISPLAY PUBLISHED BLOGS ON HOME PAGE

const homeBlogContainer = document.getElementById("blogContainer");

if (homeBlogContainer) {

    let blogs = JSON.parse(localStorage.getItem("blogs")) || [];

    blogs.forEach(blog => {

        let card = document.createElement("div");
        card.className = "blog-card";

        let title = document.createElement("h3");
        title.textContent = blog.title;

        let category = document.createElement("p");
        category.textContent = "Category: " + blog.category;

        let content = document.createElement("p");
        content.textContent = blog.content;

        let date = document.createElement("small");
        date.textContent = "Published: " + blog.date;

        card.appendChild(title);
        card.appendChild(category);
        card.appendChild(content);
        card.appendChild(date);

        homeBlogContainer.appendChild(card);
    });
}

