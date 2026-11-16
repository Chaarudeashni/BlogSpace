
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


// LOGIN FORM VALIDATION
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;
        let message = document.getElementById("loginMessage");

        if (email.trim() === "" || password.trim() === "") {
            message.textContent = "Please fill all fields.";
            message.style.color = "red";
        } else {
            message.textContent = "Login form validated successfully!";
            message.style.color = "green";
        }
    });
}


// REGISTRATION FORM VALIDATION
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let name = document.getElementById("regName").value;
        let email = document.getElementById("regEmail").value;
        let password = document.getElementById("regPassword").value;
        let confirmPassword = document.getElementById("confirmPassword").value;
        let message = document.getElementById("registerMessage");

        if (name.trim() === "" || email.trim() === "" ||
            password === "" || confirmPassword === "") {

            message.textContent = "Please fill all fields.";
            message.style.color = "red";

        } else if (password.length < 6) {

            message.textContent = "Password must contain at least 6 characters.";
            message.style.color = "red";

        } else if (password !== confirmPassword) {

            message.textContent = "Passwords do not match!";
            message.style.color = "red";

        } else {

            message.textContent = "Registration form validated successfully!";
            message.style.color = "green";
            registerForm.reset();
        }
    });
}


// DASHBOARD FUNCTIONALITY

const dashboardBlogs = document.getElementById("dashboardBlogs");

if (dashboardBlogs) {

    function displayDashboardBlogs() {

        let blogs = JSON.parse(localStorage.getItem("blogs")) || [];

        document.getElementById("totalPosts").textContent = blogs.length;

        dashboardBlogs.innerHTML = "";

        if (blogs.length === 0) {
            dashboardBlogs.innerHTML = "<p>No blog posts available. Create your first blog!</p>";
            return;
        }

        blogs.forEach((blog, index) => {

            let card = document.createElement("div");
            card.className = "blog-card";

            let title = document.createElement("h3");
            title.textContent = blog.title;

            let description = document.createElement("p");
            description.textContent = blog.content;

            let date = document.createElement("p");
            date.textContent = "Published: " + blog.date;

            let deleteButton = document.createElement("button");
            deleteButton.className = "btn";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {

                let updatedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];

                updatedBlogs.splice(index, 1);

                localStorage.setItem("blogs", JSON.stringify(updatedBlogs));

                displayDashboardBlogs();
            });

            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(date);
            card.appendChild(deleteButton);

            dashboardBlogs.appendChild(card);
        });
    }

    displayDashboardBlogs();
}

 // CREATE BLOG FUNCTIONALITY

const blogForm = document.getElementById("blogForm");

if (blogForm) {

    blogForm.addEventListener("submit", function(e) {

        e.preventDefault();

        let title = document.getElementById("blogTitle").value.trim();
        let category = document.getElementById("blogCategory").value;
        let content = document.getElementById("blogContent").value.trim();

        let message = document.getElementById("blogMessage");

        if (title === "" || category === "" || content === "") {

            message.textContent = "Please fill all fields!";
            message.style.color = "red";

            return;
        }

        let blogs = JSON.parse(localStorage.getItem("blogs")) || [];

        let newBlog = {
            title: title,
            category: category,
            content: content,
            date: new Date().toLocaleDateString()
        };

        blogs.push(newBlog);

        localStorage.setItem("blogs", JSON.stringify(blogs));

        message.textContent = "Blog published successfully!";
        message.style.color = "green";

        blogForm.reset();

        setTimeout(function() {
            window.location.href = "dashboard.html";
        }, 1000);

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

