
        document.getElementById('age').addEventListener('input', function (e) {
            if (this.value.length > 3) {
                this.value = this.value.slice(0, 3);
            }

            // Ensure age is within range 1 to 110
            if (parseInt(this.value) > 110) {
                this.value = '110';
            } else if (parseInt(this.value) < 1) {
                this.value = '1';
            }
        });

        document.getElementById('age').addEventListener('input', function () {
            const ageInput = document.getElementById('age');
            const ageValue = parseInt(ageInput.value);
    
            if (ageValue < 1 || ageValue > 110) {
                ageInput.setCustomValidity('Age must be between 1 and 110.');
                disableButtons(true);
            } else {
                ageInput.setCustomValidity('');
                checkFormValidity();
            }
        });
    
        document.getElementById('phone').addEventListener('input', function () {
            const phoneInput = document.getElementById('phone');
            const phoneValue = phoneInput.value;
    
            if (phoneValue.length !== 10 || !/^[6789]\d{9}$/.test(phoneValue)) {
                phoneInput.setCustomValidity('Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.');
                disableButtons(true);
            } else {
                phoneInput.setCustomValidity('');
                checkFormValidity();
            }
        });
    
        function disableButtons(disable) {
            buttons.forEach(button => {
                button.disabled = disable;
            });
        }
    
        const requiredFields = ['name', 'age', 'gender', 'phone', 'reason', 'appointment_date', 'time_slot'];
        const buttons = [
            document.getElementById('whatsappButton'),
            document.getElementById('smsButton'),
            document.getElementById('emailButton'),
            document.getElementById('callButton'),
            document.getElementById('formspreeButton')
        ];
    
        function checkFormValidity() {
            let allFieldsFilled = true;
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field || !field.value || (fieldId === 'age' && (field.value < 1 || field.value > 110)) || (fieldId === 'phone' && (!/^[6789]\d{9}$/.test(field.value)))) {
                    allFieldsFilled = false;
                }
            });
    
            buttons.forEach(button => {
                button.disabled = !allFieldsFilled;
            });
        }
    
        // Initially disable the buttons
        buttons.forEach(button => {
            button.disabled = true;
        });
    
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', checkFormValidity);
            }
        });
    
        function padRight(str, length) {
            return str + ' '.repeat(Math.max(0, length - str.length));
        }
    
        function padLeft(str, length) {
            return ' '.repeat(Math.max(0, length - str.length)) + str;
        }
    
        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString();
            return `${day}/${month}/${year}`;
        }
    
        function getFormData() {
            const fieldValues = {
                'Name': document.getElementById('name').value,
                'Age': document.getElementById('age').value,
                'Gender': document.getElementById('gender').value,
                'Mobile Number': document.getElementById('phone').value,
                'Reason For Appointment': document.getElementById('reason').value,
                'Appointment Date': formatDate(document.getElementById('appointment_date').value),
                'Time Slot': document.getElementById('time_slot').value
            };
    
            const maxLength = Math.max(...Object.keys(fieldValues).map(key => key.length));
            const colonPosition = 4;
            const valueStartPosition = 0; // Adjust this value as needed to ensure right alignment
    
            return Object.entries(fieldValues)
                .map(([key, value]) => 
                    `${padRight(key, colonPosition)}: ${padLeft(value, valueStartPosition - colonPosition - 5)}`)
                .join('\n');
        }
    
        document.getElementById('whatsappButton').addEventListener('click', function () {
            const message = getFormData();
            const encodedMessage = encodeURIComponent(message);
            const phoneNumber = '9094852653'; // Replace with the actual WhatsApp number
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
            window.open(whatsappUrl, '_blank');
        });
    
        document.getElementById('smsButton').addEventListener('click', function () {
            const message = getFormData();
            const encodedMessage = encodeURIComponent(message);
            const phoneNumber = '9094852653'; // Replace with the actual SMS number
            const smsUrl = `sms:${phoneNumber}?body=${encodedMessage}`;
    
            window.open(smsUrl, '_blank');
        });
    
        document.getElementById('emailButton').addEventListener('click', function () {
            const message = getFormData();
            const encodedMessage = encodeURIComponent(message);
            const email = 'balavarmaclinic@gmail.com'; // Replace with the actual email address
            const emailSubject = encodeURIComponent('Appointment Booking');
            const mailtoUrl = `mailto:${email}?subject=${emailSubject}&body=${encodedMessage}`;
    
            window.open(mailtoUrl, '_blank');
        });
    
        document.getElementById('callButton').addEventListener('click', function () {
            const phoneNumber = '9094852653'; // Replace with the actual phone number for the call
            const callUrl = `tel:${phoneNumber}`;
    
            window.open(callUrl, '_self');
        });
    
        document.getElementById('formspreeForm').addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission
            const formspreeUrl = 'https://formspree.io/f/mblrlylw';
            const message = getFormData();
            const formData = new FormData();
            formData.append('Name', document.getElementById('name').value);
            formData.append('Age', document.getElementById('age').value);
            formData.append('Gender', document.getElementById('gender').value);
            formData.append('Phone number', document.getElementById('phone').value);
            formData.append('Reason For Appointment', document.getElementById('reason').value);
            formData.append('Appointment Date', formatDate(document.getElementById('appointment_date').value));
            formData.append('Time Slot', document.getElementById('time_slot').value);
    
            fetch(formspreeUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    alert("Form submitted successfully!");
                } else {
                    alert("Failed to submit the form.");
                }
            }).catch(error => {
                alert("Error submitting form: " + error.message);
            });
        });
    
    
