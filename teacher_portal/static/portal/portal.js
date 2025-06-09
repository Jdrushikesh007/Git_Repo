// Inline editing and CRUD operations
document.addEventListener("DOMContentLoaded", () => {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const modal = document.getElementById("modal");
    const addBtn = document.getElementById("addBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const addForm = document.getElementById("addForm");

    addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));

    // Add student
    addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        fetch("/students/add/", {
            method: "POST",
            headers: { "X-CSRFToken": csrftoken },
            body: new FormData(addForm)
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) window.location.reload();
            else alert("Error: " + JSON.stringify(data.errors));
        });
    });

    // Inline edit
    document.querySelectorAll(".editable").forEach(cell => {
        cell.addEventListener("blur", () => {
            const tr = cell.closest("tr");
            const id = tr.dataset.id;
            const field = cell.dataset.field;
            const value = cell.textContent.trim();

            fetch(`/students/${id}/update/`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded", "X-CSRFToken": csrftoken },
                body: new URLSearchParams({ field, value })
            });
        });
        cell.setAttribute("contenteditable", "true");
    });

    // Delete
    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.closest("tr").dataset.id;
            if (!confirm("Delete this student?")) return;
            fetch(`/students/${id}/delete/`, {
                method: "POST",
                headers: { "X-CSRFToken": csrftoken },
            })
            .then(() => window.location.reload());
        });
    });
});

// edit 
document.addEventListener("DOMContentLoaded", () => {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Existing add modal controls here...

    // Edit modal elements
    const editModal = document.getElementById("editModal");
    const editForm = document.getElementById("editForm");
    const editCancelBtn = document.getElementById("editCancelBtn");

    // Cancel edit modal
    editCancelBtn.addEventListener("click", () => {
        editModal.classList.add("hidden");
    });

    // Open edit modal and fill form on clicking Edit button
    document.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const tr = e.target.closest("tr");
            const id = tr.dataset.id;
            const name = tr.querySelector('[data-field="name"]').textContent.trim();
            const subject = tr.querySelector('[data-field="subject"]').textContent.trim();
            const marks = tr.querySelector('[data-field="marks"]').textContent.trim();

            // Set values in edit form
            document.getElementById("editStudentId").value = id;
            document.getElementById("editName").value = name;
            document.getElementById("editSubject").value = subject;
            document.getElementById("editMarks").value = marks;

            // Show edit modal
            editModal.classList.remove("hidden");

            // Close dropdown after click
            const dropdown = btn.closest(".dropdown-menu");
            if (dropdown) dropdown.classList.add("hidden");
        });
    });

    // Submit edit form
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const id = document.getElementById("editStudentId").value;
        const formData = new FormData(editForm);

        fetch(`/students/${id}/edit/`, {
            method: "POST",
            headers: { "X-CSRFToken": csrftoken },
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Reload the page or update the table row dynamically
                window.location.reload();
            } else {
                alert("Error: " + (data.error || "Unknown error"));
            }
        });
    });
});

