// Global Theme & Mobile Navigation Controller for EduGuide-AI

document.addEventListener("DOMContentLoaded", () => {
    // Theme Toggle Initialization
    const themeBtn = document.getElementById("themeToggle");
    const currentTheme = localStorage.getItem("eduguide_theme");

    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeBtn) themeBtn.textContent = "☀️";
    } else {
        if (themeBtn) themeBtn.textContent = "🌙";
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            localStorage.setItem("eduguide_theme", isDark ? "dark" : "light");
            themeBtn.textContent = isDark ? "☀️" : "🌙";
        });
    }

    // Mobile Navigation Drawer Toggle
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            mobileBtn.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
        });
    }
});
