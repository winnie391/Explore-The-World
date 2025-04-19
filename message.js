document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        //Get values from user
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        //Ensure no empty value
        if (name === "" || email === "" || subject === "" || message === "") {
            alert("Please fill in all fields.");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Create message to copy
        const fullMessage = `Hi, I am ${name}\nEmail: ${email}\nSubject: ${subject}\nText: ${message}`;

        // Copy to clipboard
        navigator.clipboard.writeText(fullMessage).then(() => {
            const confirmRedirect = confirm("✅ Your message has been copied!\nClick OK to go to our Instagram page and paste it in DMs. We will contact you ASAP!");
            if (confirmRedirect) {
                window.location.href = "https://www.instagram.com/exploretheworld_2323/";
            }
        }).catch(err => {
            alert("❌ Failed to copy message. Please try again.");
            console.error("Clipboard error:", err);
        });
    });

    //Check email format
    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }
});