console.log("NEW SCRIPT.JS LOADED");
console.log("Online Health Consultation Platform");


// =====================================================
// REGISTER
// =====================================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const fullName =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const phone =
            document.getElementById("phone").value;

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirm-password").value;

        const role =
            document.getElementById("role").value;


        if (password !== confirmPassword) {

            alert("Passwords do not match!");
            return;
        }


        const userData = {

            fullName: fullName,
            email: email,
            phone: phone,
            password: password,
            role: role
        };


        fetch("http://localhost:8080/api/users/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)

        })

            .then(response => {

                if (!response.ok) {
                    throw new Error("Registration failed");
                }

                return response.json();
            })

            .then(data => {

                alert("Registration successful!");

                console.log(data);

                registerForm.reset();

                window.location.href = "login.html";
            })

            .catch(error => {

                console.error(error);

                alert("Registration failed. Please try again.");
            });

    });
}


// =====================================================
// LOGIN
// =====================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;


        const loginData = {

            email: email,
            password: password
        };


        fetch("http://localhost:8080/api/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginData)

        })

            .then(response => {

                if (!response.ok) {
                    throw new Error("Login failed");
                }

                return response.json();
            })

            .then(data => {

                alert("Login successful!");
                localStorage.setItem("userEmail", data.email);



                localStorage.setItem(
                    "userRole",
                    data.role
                );

                localStorage.setItem(
                    "userName",
                    data.fullName
                );

                if (data.role === "patient") {
                    window.location.href = "/Online-Health-consultation/patient-dashboard.html";
                }
                else if (data.role === "doctor") {
                    window.location.href = "/Online-Health-consultation/docto-dashboard.html";
                }

                console.log(data);
            })

            .catch(error => {

                console.error(error);

                alert("Invalid email or password");
            });

    });
}


// =====================================================
// SELECT DOCTOR
// =====================================================

window.addEventListener("load", function () {

    const doctorSelect =
        document.getElementById("doctor");


    if (!doctorSelect) {
        return;
    }


    const selectedDoctor =
        new URLSearchParams(
            window.location.search
        ).get("doctor");


    if (selectedDoctor) {

        doctorSelect.value =
            selectedDoctor;
    }

});


// =====================================================
// APPOINTMENT BOOKING
// =====================================================

const appointmentForm =
    document.querySelector(".appointment-box form");


if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const doctorName =
                document.getElementById("doctor").value;

            const appointmentDate =
                document.getElementById("date").value;

            const appointmentTime =
                document.getElementById("time").value;

            const reason =
                document.getElementById("reason").value;

            const patientEmail =
                localStorage.getItem("userEmail");


            const appointmentData = {

                doctorName: doctorName,

                appointmentDate:
                    appointmentDate,

                appointmentTime:
                    appointmentTime,

                reason: reason,

                patientEmail:
                    patientEmail
            };


            fetch(
                "http://localhost:8080/api/appointments/book",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            appointmentData
                        )
                }
            )

                .then(response => {

                    if (!response.ok) {

                        throw new Error(
                            "Appointment booking failed"
                        );
                    }

                    return response.json();
                })

                .then(data => {

                    alert(
                        "Appointment booked successfully!"
                    );

                    console.log(data);

                    appointmentForm.reset();
                })

                .catch(error => {

                    console.error(error);

                    alert(
                        "Appointment booking failed!"
                    );
                });

        }
    );
}

// =====================================================
// PATIENT APPOINTMENTS
// =====================================================

const appointmentList =
    document.getElementById("appointmentList");

if (appointmentList) {

    const patientEmail =
        localStorage.getItem("userEmail");

    if (!patientEmail) {

        alert("Please login first.");

        window.location.href =
            "login.html";
    }

    else {

        fetch(
            `http://localhost:8080/api/appointments/patient/${patientEmail}`
        )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to load appointments"
                    );
                }

                return response.json();
            })

            .then(appointments => {

                appointmentList.innerHTML = "";

                if (appointments.length === 0) {

                    appointmentList.innerHTML =
                        "<p>No appointments found.</p>";

                    return;
                }

                appointments.forEach(
                    appointment => {

                        const card =
                            document.createElement("div");

                        card.className =
                            "appointment-card";

                        card.innerHTML = `

    <h3>
        ${appointment.doctorName}
    </h3>

    <p>
        <strong>Date:</strong>
        ${appointment.appointmentDate}
    </p>

    <p>
        <strong>Time:</strong>
        ${appointment.appointmentTime}
    </p>

    <p>
        <strong>Reason:</strong>
        ${appointment.reason}
    </p>

    <p>
        <strong>Status:</strong>
        <span class="appointment-status">
            ${appointment.status}
        </span>
    </p>

    ${appointment.status === "Accepted"
                                ?
                                `
        <a
            href="consultation.html?appointmentId=${appointment.id}"
            class="btn">
            Start Consultation
        </a>
        `
                                :
                                ""
                            }

`;

                        appointmentList.appendChild(card);
                    }
                );
            })

            .catch(error => {

                console.error(error);

                appointmentList.innerHTML =
                    "<p>Unable to load appointments.</p>";
            });
    }
}


// =====================================================
// DOCTOR APPOINTMENTS
// =====================================================

const doctorAppointmentList =
    document.getElementById(
        "doctorAppointmentList"
    );


if (doctorAppointmentList) {

    fetch(
        "http://localhost:8080/api/appointments/doctor"
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load doctor appointments"
                );
            }

            return response.json();
        })

        .then(appointments => {

            doctorAppointmentList.innerHTML =
                "";


            if (appointments.length === 0) {

                doctorAppointmentList.innerHTML =
                    "<p>No patient appointments found.</p>";

                return;
            }


            appointments.forEach(
                appointment => {

                    const card =
                        document.createElement("div");


                    card.className =
                        "appointment-card";


                    card.innerHTML = `

                    <h2>
                        Patient Email:
                        ${appointment.patientEmail}
                    </h2>

                    <p>
                        <strong>Doctor:</strong>
                        ${appointment.doctorName}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${appointment.appointmentDate}
                    </p>

                    <p>
                        <strong>Time:</strong>
                        ${appointment.appointmentTime}
                    </p>

                    <p>
                        <strong>Reason:</strong>
                        ${appointment.reason}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        <span class="status-confirmed">
                            ${appointment.status}
                        </span>
                    </p>

                    <div class="request-buttons">

                        <button
                            class="accept-btn"
                            onclick="updateDoctorAppointmentStatus(${appointment.id}, 'Accepted')">

                            Accept

                        </button>

                        <button
                            class="reject-btn"
                            onclick="updateDoctorAppointmentStatus(${appointment.id}, 'Rejected')">

                            Reject

                        </button>

                    </div>

                `;


                    doctorAppointmentList
                        .appendChild(card);

                }
            );

        })

        .catch(error => {

            console.error(error);

            doctorAppointmentList.innerHTML =
                "<p>Unable to load appointments.</p>";
        });
}


// =====================================================
// UPDATE DOCTOR APPOINTMENT STATUS
// =====================================================

function updateDoctorAppointmentStatus(
    id,
    status
) {

    fetch(
        `http://localhost:8080/api/appointments/${id}/status?status=${status}`,
        {
            method: "PUT"
        }
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to update appointment status"
                );
            }

            return response.json();
        })

        .then(updatedAppointment => {

            alert(
                "Appointment " +
                updatedAppointment.status +
                " successfully!"
            );

            location.reload();
        })

        .catch(error => {

            console.error(error);

            alert(
                "Failed to update appointment status."
            );
        });
}


// =====================================================
// PATIENT REQUESTS
// =====================================================

const requestList =
    document.getElementById("requestList");


if (requestList) {

    fetch(
        "http://localhost:8080/api/appointments/doctor"
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load requests"
                );
            }

            return response.json();
        })

        .then(requests => {

            requestList.innerHTML = "";


            if (requests.length === 0) {

                requestList.innerHTML =
                    "<p>No patient requests found.</p>";

                return;
            }


            requests.forEach(request => {

                const card =
                    document.createElement("div");


                card.className =
                    "request-card";


                card.innerHTML = `

                <h2>
                    Patient:
                    ${request.patientName}
                </h2>

                <p>
    <strong>Email:</strong>
    ${request.patientEmail}
</p>

                <p>
                    <strong>Request Type:</strong>
                    Online Consultation
                </p>

                <p>
                    <strong>Doctor:</strong>
                    ${request.doctorName}
                </p>

                <p>
                    <strong>Requested Date:</strong>
                    ${request.appointmentDate}
                </p>

                <p>
                    <strong>Requested Time:</strong>
                    ${request.appointmentTime}
                </p>

                <p>
                    <strong>Reason:</strong>
                    ${request.reason}
                </p>

                <p>
                    <strong>Status:</strong>
                    <span class="request-status">
                        ${request.status}
                    </span>
                </p>

                <div class="request-buttons">

                    <button class="accept-btn">
                        Accept
                    </button>

                    <button class="reject-btn">
                        Reject
                    </button>

                </div>

            `;


                requestList.appendChild(card);


                const acceptButton =
                    card.querySelector(
                        ".accept-btn"
                    );


                acceptButton.addEventListener(
                    "click",
                    function () {

                        updateRequestStatus(
                            request.id,
                            "Accepted",
                            card
                        );

                    }
                );


                const rejectButton =
                    card.querySelector(
                        ".reject-btn"
                    );


                rejectButton.addEventListener(
                    "click",
                    function () {

                        updateRequestStatus(
                            request.id,
                            "Rejected",
                            card
                        );

                    }
                );

            });

        })

        .catch(error => {

            console.error(error);

            requestList.innerHTML =
                "<p>Unable to load patient requests.</p>";
        });
}


// =====================================================
// UPDATE REQUEST STATUS
// =====================================================

function updateRequestStatus(
    id,
    status,
    card
) {

    fetch(
        `http://localhost:8080/api/appointments/${id}/status?status=${status}`,
        {
            method: "PUT"
        }
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to update status"
                );
            }

            return response.json();
        })

        .then(updatedAppointment => {

            const statusElement =
                card.querySelector(
                    ".request-status"
                );


            statusElement.textContent =
                updatedAppointment.status;


            alert(
                "Request " +
                updatedAppointment.status +
                " successfully!"
            );

        })

        .catch(error => {

            console.error(error);

            alert(
                "Failed to update request status."
            );
        });
}


// =====================================================
// REAL-TIME CONSULTATION CHAT
// =====================================================

const sendMessage =
    document.getElementById("sendMessage");

const chatInput =
    document.getElementById("chatInput");

const chatMessages =
    document.getElementById("chatMessages");


if (
    sendMessage &&
    chatInput &&
    chatMessages
) {

    let chatClient = null;


    const chatUserId =
        Math.random()
            .toString(36)
            .substring(2, 10);


    function addChatMessage(
        sender,
        message
    ) {

        const messageElement =
            document.createElement("p");


        const senderElement =
            document.createElement("strong");


        senderElement.textContent =
            sender + ": ";


        messageElement.appendChild(
            senderElement
        );


        messageElement.appendChild(
            document.createTextNode(
                message
            )
        );


        chatMessages.appendChild(
            messageElement
        );


        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }


    function connectChat() {

        if (
            typeof StompJs ===
            "undefined"
        ) {

            console.error(
                "STOMP library not loaded."
            );

            return;
        }


        chatClient =
            new StompJs.Client({

                brokerURL:
                    "ws://localhost:8080/ws",

                reconnectDelay:
                    5000,

                debug:
                    function (message) {

                        console.log(
                            "Chat WebSocket:",
                            message
                        );
                    }
            });


        chatClient.onConnect =
            function () {

                console.log(
                    "Real-time chat connected"
                );


                chatClient.subscribe(
                    "/topic/chat",
                    function (message) {

                        try {

                            const data =
                                JSON.parse(
                                    message.body
                                );


                            if (
                                data.sender ===
                                chatUserId
                            ) {

                                return;
                            }


                            addChatMessage(

                                data.senderName ||
                                "Other",

                                data.message
                            );

                        }

                        catch (error) {

                            console.error(
                                "Chat message error:",
                                error
                            );
                        }

                    }
                );

            };


        chatClient.onStompError =
            function (frame) {

                console.error(
                    "Chat WebSocket error:",
                    frame
                );
            };


        chatClient.activate();
    }


    function sendChatMessage() {

        const message =
            chatInput.value.trim();


        if (message === "") {
            return;
        }


        if (
            !chatClient ||
            !chatClient.connected
        ) {

            alert(
                "Chat is connecting. Please try again in a moment."
            );

            return;
        }


        const chatData = {

            sender:
                chatUserId,

            senderName:
                "User",

            message:
                message
        };


        chatClient.publish({

            destination:
                "/app/chat",

            body:
                JSON.stringify(chatData)
        });


        addChatMessage(
            "You",
            message
        );


        chatInput.value = "";
    }


    sendMessage.addEventListener(
        "click",
        sendChatMessage
    );


    chatInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendChatMessage();
            }

        }
    );


    connectChat();
}


// =====================================================
// START CONSULTATION
// =====================================================

const startConsultation =
    document.getElementById(
        "startConsultation"
    );


if (startConsultation) {

    startConsultation.addEventListener(
        "click",
        function () {

            alert(
                "Consultation started successfully!"
            );


            startConsultation.innerText =
                "Consultation Started";


            startConsultation.disabled =
                true;

        }
    );
}


// =====================================================
// PATIENT PROFILE
// =====================================================

const profileName =
    document.getElementById(
        "profileName"
    );


if (profileName) {

    const patientEmail =
        localStorage.getItem(
            "userEmail"
        );


    if (!patientEmail) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

    }

    else {

        fetch(
            `http://localhost:8080/api/users/${patientEmail}`
        )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to load profile"
                    );
                }

                return response.json();
            })

            .then(user => {

                document.getElementById(
                    "profileName"
                ).textContent =
                    user.fullName;


                document.getElementById(
                    "profileEmail"
                ).textContent =
                    user.email;


                document.getElementById(
                    "profilePhone"
                ).textContent =
                    user.phone;


                document.getElementById(
                    "profileRole"
                ).textContent =
                    user.role;

            })

            .catch(error => {

                console.error(error);


                document.getElementById(
                    "profileName"
                ).textContent =
                    "Unable to load";


                document.getElementById(
                    "profileEmail"
                ).textContent =
                    "Unable to load";


                document.getElementById(
                    "profilePhone"
                ).textContent =
                    "Unable to load";


                document.getElementById(
                    "profileRole"
                ).textContent =
                    "Unable to load";
            });
    }
}


// =====================================================
// DOCTOR PROFILE
// =====================================================

const doctorName =
    document.getElementById(
        "doctorName"
    );


if (doctorName) {

    const doctorEmail =
        new URLSearchParams(
            window.location.search
        ).get("email") ||
        localStorage.getItem(
            "userEmail"
        );


    if (!doctorEmail) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

    }

    else {

        fetch(
            `http://localhost:8080/api/users/${doctorEmail}`
        )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to load doctor profile"
                    );
                }

                return response.json();
            })

            .then(doctor => {

                document.getElementById(
                    "doctorName"
                ).textContent =
                    doctor.fullName;


                document.getElementById(
                    "doctorSpecialization"
                ).textContent =
                    doctor.specialization;


                document.getElementById(
                    "doctorExperience"
                ).textContent =
                    doctor.experience;


                document.getElementById(
                    "doctorFee"
                ).textContent =
                    doctor.consultationFee;


                document.getElementById(
                    "doctorQualification"
                ).textContent =
                    doctor.qualification;


                document.getElementById(
                    "doctorAvailability"
                ).textContent =
                    doctor.availability;


                document.getElementById(
                    "doctorEmail"
                ).textContent =
                    doctor.email;


                document.getElementById(
                    "doctorPhone"
                ).textContent =
                    doctor.phone;

            })

            .catch(error => {

                console.error(error);


                document.getElementById(
                    "doctorName"
                ).textContent =
                    "Unable to load";


                document.getElementById(
                    "doctorSpecialization"
                ).textContent =
                    "Unable to load";
            });
    }
}


// =====================================================
// UPDATE DOCTOR PROFILE
// =====================================================

const doctorProfileForm =
    document.getElementById(
        "doctorProfileForm"
    );


if (doctorProfileForm) {

    const doctorEmail =
        localStorage.getItem(
            "userEmail"
        );


    if (!doctorEmail) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

    }

    else {

        // ---------------------------------------------
        // LOAD DOCTOR DETAILS
        // ---------------------------------------------

        fetch(
            `http://localhost:8080/api/users/${doctorEmail}`
        )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to load doctor details"
                    );
                }

                return response.json();
            })

            .then(doctor => {

                document.getElementById(
                    "specialization"
                ).value =
                    doctor.specialization || "";


                document.getElementById(
                    "experience"
                ).value =
                    doctor.experience || "";


                document.getElementById(
                    "qualification"
                ).value =
                    doctor.qualification || "";


                document.getElementById(
                    "consultationFee"
                ).value =
                    doctor.consultationFee || "";


                document.getElementById(
                    "availability"
                ).value =
                    doctor.availability || "";

            })

            .catch(error => {

                console.error(error);
            });


        // ---------------------------------------------
        // SAVE DOCTOR PROFILE
        // ---------------------------------------------

        doctorProfileForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const doctorData = {

                    email:
                        doctorEmail,

                    specialization:
                        document.getElementById(
                            "specialization"
                        ).value,

                    experience:
                        document.getElementById(
                            "experience"
                        ).value,

                    qualification:
                        document.getElementById(
                            "qualification"
                        ).value,

                    consultationFee:
                        document.getElementById(
                            "consultationFee"
                        ).value,

                    availability:
                        document.getElementById(
                            "availability"
                        ).value
                };


                fetch(
                    "http://localhost:8080/api/users/doctor-profile",
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                doctorData
                            )
                    }
                )

                    .then(response => {

                        if (!response.ok) {

                            throw new Error(
                                "Failed to update profile"
                            );
                        }

                        return response.json();
                    })

                    .then(updatedDoctor => {

                        alert(
                            "Doctor profile updated successfully!"
                        );


                        const nameElement =
                            document.getElementById(
                                "doctorName"
                            );

                        if (nameElement) {

                            nameElement.textContent =
                                updatedDoctor.fullName;
                        }


                        const specializationElement =
                            document.getElementById(
                                "doctorSpecialization"
                            );

                        if (specializationElement) {

                            specializationElement.textContent =
                                updatedDoctor.specialization;
                        }


                        const experienceElement =
                            document.getElementById(
                                "doctorExperience"
                            );

                        if (experienceElement) {

                            experienceElement.textContent =
                                updatedDoctor.experience;
                        }


                        const feeElement =
                            document.getElementById(
                                "doctorFee"
                            );

                        if (feeElement) {

                            feeElement.textContent =
                                updatedDoctor.consultationFee;
                        }


                        const qualificationElement =
                            document.getElementById(
                                "doctorQualification"
                            );

                        if (qualificationElement) {

                            qualificationElement.textContent =
                                updatedDoctor.qualification;
                        }


                        const availabilityElement =
                            document.getElementById(
                                "doctorAvailability"
                            );

                        if (availabilityElement) {

                            availabilityElement.textContent =
                                updatedDoctor.availability;
                        }


                        const emailElement =
                            document.getElementById(
                                "doctorEmail"
                            );

                        if (emailElement) {

                            emailElement.textContent =
                                updatedDoctor.email;
                        }


                        const phoneElement =
                            document.getElementById(
                                "doctorPhone"
                            );

                        if (phoneElement) {

                            phoneElement.textContent =
                                updatedDoctor.phone;
                        }

                    })

                    .catch(error => {

                        console.error(error);

                        alert(
                            "Failed to update doctor profile."
                        );
                    });

            }
        );
    }
}

// =====================================================
// PATIENT DASHBOARD WELCOME
// =====================================================

const welcomeMessage =
    document.getElementById("welcomeMessage");

if (welcomeMessage) {

    const userName =
        localStorage.getItem("userName");

    if (userName) {

        welcomeMessage.textContent =
            "Welcome, " + userName + "!";
    }
}

// =====================================================
// DOCTOR DASHBOARD WELCOME
// =====================================================

const doctorWelcomeMessage =
    document.getElementById("doctorWelcomeMessage");

if (doctorWelcomeMessage) {

    const doctorName =
        localStorage.getItem("userName");

    if (doctorName) {

        doctorWelcomeMessage.textContent =
            "Welcome, Dr. " + doctorName + "!";
    }
}

// =====================================================
// LOGOUT
// =====================================================

const logoutLinks =
    document.querySelectorAll('a[href="login.html"]');

logoutLinks.forEach(link => {

    if (link.textContent.trim() === "Logout") {

        link.addEventListener("click", function () {

            localStorage.removeItem("userEmail");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userName");

        });
    }
});

// =====================================================
// PATIENT DASHBOARD SECURITY
// =====================================================

if (window.location.pathname.endsWith("patient-dashboard.html")) {

    const userEmail =
        localStorage.getItem("userEmail");

    const userRole =
        localStorage.getItem("userRole");

    if (!userEmail || userRole !== "patient") {

        alert("Please login as a patient first.");

        window.location.href =
            "login.html";
    }
}

const doctorContainer =
    document.getElementById("doctorContainer");

if (doctorContainer) {

    fetch("http://localhost:8080/api/users/doctors")

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load doctors");
            }

            return response.json();
        })

        .then(doctors => {

            doctorContainer.innerHTML = "";

            if (doctors.length === 0) {

                doctorContainer.innerHTML =
                    "<p>No doctors available.</p>";

                return;
            }

            doctors.forEach(doctor => {

                const card =
                    document.createElement("div");

                card.className = "doctor-card";

                card.innerHTML = `

                    <div class="doctor-image">
                        👨‍⚕️
                    </div>

                    <h2>
                        ${doctor.fullName}
                    </h2>

                    <h3>
                        ${doctor.specialization || "Doctor"}
                    </h3>

                    <p>
                        Experience:
                        ${doctor.experience || "Not available"}
                    </p>

                    <p>
                        Consultation Fee:
                        ₹${doctor.consultationFee || "Not available"}
                    </p>

                    <a
                        href="doctor-profile.html?email=${encodeURIComponent(doctor.email)}"
                        class="btn">
                        View Profile
                    </a>

                `;

                doctorContainer.appendChild(card);

            });

        })

        .catch(error => {

            console.error(error);

            doctorContainer.innerHTML =
                "<p>Unable to load doctors.</p>";

        });
}

const doctorSelect =
    document.getElementById("doctor");

if (doctorSelect) {

    fetch("http://localhost:8080/api/users/doctors")

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load doctors");
            }

            return response.json();
        })

        .then(doctors => {

            doctorSelect.innerHTML =
                '<option value="">Select Doctor</option>';

            if (doctors.length === 0) {

                doctorSelect.innerHTML =
                    '<option value="">No doctors available</option>';

                return;
            }

            doctors.forEach(doctor => {

                const option =
                    document.createElement("option");

                option.value =
                    doctor.fullName;

                option.textContent =
                    doctor.fullName;

                doctorSelect.appendChild(option);

            });

        })

        .catch(error => {

            console.error(error);

            doctorSelect.innerHTML =
                '<option value="">Unable to load doctors</option>';

        });
}

const consultDoctor =
    document.getElementById("consultDoctor");

if (consultDoctor) {

    const params =
        new URLSearchParams(window.location.search);

    const appointmentId =
        params.get("appointmentId");

    if (!appointmentId) {

        consultDoctor.textContent =
            "Appointment not found";

    } else {

        fetch(
            "http://localhost:8080/api/appointments/doctor"
        )

            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Failed to load consultation"
                    );
                }

                return response.json();
            })

            .then(appointments => {

                const appointment =
                    appointments.find(
                        a => String(a.id) === String(appointmentId)
                    );

                if (!appointment) {

                    consultDoctor.textContent =
                        "Appointment not found";

                    return;
                }

                consultDoctor.textContent =
                    appointment.doctorName;

                document.getElementById(
                    "consultPatient"
                ).textContent =
                    appointment.patientName;

                document.getElementById(
                    "consultSpecialization"
                ).textContent =
                    "Online Consultation";

            })

            .catch(error => {

                console.error(error);

                consultDoctor.textContent =
                    "Unable to load";

            });
    }
}