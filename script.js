
const form = document.getElementById("UserForm");
const submitBtn = document.getElementById("submitBtn");
const resultMsg = document.getElementById("resultMsg");

const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    language: document.getElementById("language"),
    about: document.getElementById("about"),
    phone: document.getElementById("phone"),
    togglePhone: document.getElementById("togglePhone"),
};

const errors = {
    nameError: document.getElementById("nameError"),
    emailError: document.getElementById("emailError"),
    passwordError: document.getElementById("passwordError"),
    languageError: document.getElementById("languageError"),
    aboutError: document.getElementById("aboutError"),
    phoneError: document.getElementById("phoneError"),
};
fields.togglePhone.addEventListener("change", () => {
    document.getElementById("phoneSection").style.display = fields.togglePhone.checked ? "block" : "none";
    validateForm();
});

function validateName() {
    const val = fields.fullName.value.trim();
    if (val.length < 3) {
        errors.nameError.textContent = "Name must be at least 3 characters";
        return false;
    }
    errors.nameError.textContent = "";
    return true;
}

function validateEmail() {
    const val = fields.email.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) {
        errors.emailError.textContent = "Invalid email format";
        return false;
    }
    errors.emailError.textContent = "";
    return true;
}
function validatePassword() {
    const val = fields.password.value.trim();
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!regex.test(val)) {
        errors.passwordError.textContent = "password must be 8+ characters , include letters and numbers.";
        return false;
    }
    errors.passwordError.textContent = "";
    return true;
}
function validateLanguage() {
    if (fields.language.value === "") {
        errors.languageError.textContent = "Please select a language";
        return false;
    }
    errors.languageError.textContent = "";
    return true;
}

function validateAbout() {
    const val = fields.about.value.trim();
    if (val.length < 20) {
        errors.aboutError.textContent = "About section must be atleast 20 characters";
        return false;
    }
    errors.aboutError.textContent = "";
    return true;
}

function validatePhone() {
    if (!fields.togglePhone.checked) {
        errors.phoneError.textContent = "";
        return true;
    }
    const val = fields.phone.value.trim();
    const regex = /^\d{10}$/;
    if (!regex.test(val)) {
        errors.phoneError.textContent = "Enter a valid 10- digit number";
        return false;
    }
    errors.phoneError.textContent = "";
    return true;
}

function validateForm() {
    const valid = validateName() && validateEmail() && validatePassword() && validateLanguage() && validateAbout() && validatePhone();
    submitBtn.disabled = !valid;
    return valid;
}

[
    fields.fullName,
    fields.email,
    fields.password,
    fields.language,
    fields.about,
    fields.phone,
].forEach((el) => el.addEventListener("input", validateForm));

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = {
        name: fields.fullName.value,
        email: fields.email.value,
        password: fields.password.value,
        language: fields.language.value,
        about: fields.about.value,
        phone: fields.togglePhone.checked ? fields.phone.value : null,
    };

    try {
        const res = await fetch("https://admin-staging.whydonate.dev/whydonate/assignment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.status === 200) {
            resultMsg.textContent = "Form submitted successfully!";
            resultMsg.style.color = "green";
            form.reset();
            submitBtn.disabled = true;
            document.getElementById("phoneSection").style.display = "none";
        }
        else if (res.status === 400) {
            resultMsg.textContent = "Submission failed";
            resultMsg.style.color = "red";
        }
        else {
            resultMsg.textContent = "Unexpected error";
            resultMsg.style.color = "red";

        }

    }

    catch (err) {
        resultMsg.textContent = "Network error";
        resultMsg.style.color = "red";
    }
    finally {
        submitBtn.disabled = false;
    }
});
