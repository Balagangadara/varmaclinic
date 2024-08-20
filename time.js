   async function loadSlots() {
    const dateInput = document.getElementById('date').value;
    if (!dateInput) {
        alert('Please select a date.');
        return;
    }

    const formattedDate = formatDateToYYYYMMDD(dateInput);
    console.log(`Fetching slots for date: ${formattedDate}`); // Debug log

    try {
        const response = await fetch('https://raw.githubusercontent.com/Balagangadara/timeblock/main/time.json');

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Data fetched:', data); // Debug log

        const dayData = data[formattedDate];
        if (!dayData || !Array.isArray(dayData)) {
            document.getElementById('available-slots').innerHTML = '<p>No time slots available for this date.</p>';
            return;
        }

        const container = document.getElementById('available-slots');
        container.innerHTML = '';

        let bookedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '{}');
        bookedSlots = bookedSlots[formattedDate] || [];

        let selectedSlotId = localStorage.getItem('selectedSlotId');

        // Get current date and time
        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes(); // Current time in HHMM format
        const today = formatDateToYYYYMMDD(now);

        dayData.forEach(slot => {
            if (!slot || typeof slot !== 'object') {
                console.warn('Invalid slot data:', slot);
                return;
            }
            const slotTime = parseInt(slot.time.replace(':', ''), 10); // Convert slot time to HHMM format
            const isPastSlot = (formattedDate === today && slotTime < currentTime) || (formattedDate !== today && formattedDate < today);

            const slotDiv = document.createElement('div');
            slotDiv.className = 'slot';

            const slotButton = createSlotButton(slot, bookedSlots, selectedSlotId, isPastSlot);
            slotDiv.appendChild(slotButton);
            container.appendChild(slotDiv);

            // Automatically select the first available slot if none is selected
            if (!selectedSlotId && !bookedSlots.includes(slot.id)) {
                selectedSlotId = slot.id;
                localStorage.setItem('selectedSlotId', selectedSlotId);
                updateSlotButtons(formattedDate, selectedSlotId, slot.time);
            }
        });

        loadFormData();
        updateButtonStates();

    } catch (error) {
        console.error('Error loading slots:', error);
        document.getElementById('available-slots').innerHTML = `<p>Error loading slots: ${error.message}. Please try again later.</p>`;
    }
}

function createSlotButton(slot, bookedSlots, selectedSlotId, isPastSlot) {
    const slotButton = document.createElement('button');
    const isBooked = slot.booked || bookedSlots.includes(slot.id) || isPastSlot;

    // Set the button class and disable state based on whether the slot is booked or not
    slotButton.className = isBooked ? 'booked' : 'available';
    slotButton.disabled = isBooked;

    // Only display the time on the button
    slotButton.textContent = slot.time;
    slotButton.dataset.slotId = slot.id;
    slotButton.dataset.slotTime = slot.time;

    slotButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default behavior
        event.stopPropagation(); // Prevent event bubbling

        if (!isBooked) {
            handleSlotClick(slot.id, slot.time);
        }
    });

    return slotButton;
}

function handleSlotClick(slotId, slotTime) {
    const dateInput = document.getElementById('date').value;
    if (!dateInput) {
        alert('Please select a date.');
        return;
    }

    const formattedDate = formatDateToYYYYMMDD(dateInput);
    let bookedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '{}');
    bookedSlots = bookedSlots[formattedDate] || [];

    if (!bookedSlots.includes(slotId)) {
        bookedSlots.push(slotId);
        localStorage.setItem('bookedSlots', JSON.stringify({ ...bookedSlots, [formattedDate]: bookedSlots }));
        localStorage.setItem('selectedSlotId', slotId);
        updateSlotButtons(formattedDate, slotId, slotTime);
        saveFormData(); // Save form data whenever a slot is booked
        updateButtonStates(); // Update button states after slot selection
    }
}

function updateSlotButtons(date, slotId, slotTime) {
    const slots = document.querySelectorAll('#available-slots .slot button');
    slots.forEach(button => {
        const buttonId = button.dataset.slotId;
        if (buttonId === slotId.toString()) {
            button.disabled = false; // Always enable selected slot
            button.className = 'selected'; // Apply selected class
            button.textContent = slotTime; // Show only time for selected slot
        } else {
            button.className = 'available'; // Ensure other buttons are available
            button.disabled = false;
            button.textContent = button.dataset.slotTime; // Show available slot time
        }
    });
}

function updateButtonStates() {
    const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '{}');
    const dateInput = document.getElementById('date')?.value;
    const name = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const selectedSlotId = localStorage.getItem('selectedSlotId');


    if (dateInput) {
        const formattedDate = formatDateToYYYYMMDD(dateInput);
        const slots = document.querySelectorAll('#available-slots .slot button');
        const dateBookedSlots = bookedSlots[formattedDate] || [];
        const selectedSlotId = localStorage.getItem('selectedSlotId');

       
            slots.forEach(button => {
            const buttonId = button.dataset.slotId;
            const isBooked = bookedSlots[formattedDate] && bookedSlots[formattedDate].includes(parseInt(buttonId, 10));
        
            const buttonIdMatch = button.getAttribute('onclick')?.match(/(\d+)/);
            if (buttonIdMatch) {
                const slotId = parseInt(buttonIdMatch[1], 10);
                const slotTime = button.textContent.match(/\((.*?)\)/)?.[1] || ''; // Extract time
                // const isBooked = bookedSlots[formattedDate] && bookedSlots[formattedDate].includes(slotId);
                // // button.disabled = isBooked;
                 button.className = isBooked ? 'booked' : 'available';
                button.textContent = isBooked ? `Booked (${slotTime})` : `Available (${slotTime})`;
            }
        });

        // Enable or disable communication buttons based on form and slot selection
        if (isFormComplete() && selectedSlotId) {
            enableCommunicationButtons();
        } else {
            disableCommunicationButtons();
        }
    }
}

// Modify the isFormComplete function if necessary to handle these validations
function isFormComplete() {
    const name = document.getElementById('name')?.value.trim();
    const age = document.getElementById('age')?.value.trim();
    const gender = document.getElementById('gender')?.value;
    const phone = document.getElementById('phone')?.value.trim();
    const reasons = Array.from(document.querySelectorAll('input[name="reason"]:checked')).map(cb => cb.value);
    const date = document.getElementById('date')?.value;
    const selectedSlot = localStorage.getItem('selectedSlotId');

    return name && name.length >= 3 && age && gender && phone && phone.length >= 10 && reasons.length > 0 && date && selectedSlot;
}
function saveFormData() {
    const formData = {
        name: document.getElementById('name')?.value.trim(),
        age: document.getElementById('age')?.value.trim(),
        gender: document.getElementById('gender')?.value,
        phone: document.getElementById('phone')?.value.trim(),
        reasons: Array.from(document.querySelectorAll('input[name="reason"]:checked')).map(cb => cb.value),
        date: document.getElementById('date')?.value // Save the raw date format
    };
    localStorage.setItem('formData', JSON.stringify(formData));
}

function loadFormData() {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (formData) {
        document.getElementById('name').value = formData.name;
        document.getElementById('age').value = formData.age;
        document.getElementById('gender').value = formData.gender;
        document.getElementById('phone').value = formData.phone;
        document.getElementById('date').value = formData.date; // Load the raw date format

        // Check the checkboxes based on saved data
        document.querySelectorAll('input[name="reason"]').forEach(cb => {
            if (formData.reasons.includes(cb.value)) {
                cb.checked = true;
            }
        });
    }
    updateButtonStates(); // Check button states when loading form data
}

function enableCommunicationButtons() {
    document.getElementById('whatsappButton').disabled = false;
    document.getElementById('smsButton').disabled = false;
    document.getElementById('emailButton').disabled = false;
    document.getElementById('callButton').disabled = false;
}

function disableCommunicationButtons() {
    document.getElementById('whatsappButton').disabled = true;
    document.getElementById('smsButton').disabled = true;
    document.getElementById('emailButton').disabled = true;
    document.getElementById('callButton').disabled = true;
}

function formatDateToYYYYMMDD(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

function formatDateToDDMMYYYY(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function getSelectedTimeSlot() {
    const slotId = localStorage.getItem('selectedSlotId');
    if (slotId) {
        const slots = document.querySelectorAll('#available-slots .slot button');
        for (let button of slots) {
            if (button.dataset.slotId === slotId) {
                return button.dataset.slotTime;
            }
        }
    }
    return 'No time selected';
}

function getFormattedMessage() {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (!formData) {
        alert('Form data is missing.');
        return '';
    }

    const { name, age, gender, phone, reasons, date } = formData;
    const formattedDate = formatDateToDDMMYYYY(date);
    const time = getSelectedTimeSlot();

    // Join reasons array into a comma-separated string
    let reasonsString = reasons.join(', ');

    // Include "Others" input value if the checkbox is checked and "Others" is in the reasons
    const othersInput = document.getElementById('othersInput');
    const othersCheckbox = document.querySelector('input[name="reason"][value="Others"]');
    if (othersCheckbox.checked && othersInput.value.trim()) {
        if (reasons.includes('')) {
            reasonsString += `, ${othersInput.value}`;
        } else {
            reasonsString += `, ${othersInput.value}`;
        }
    }

    return `Name: ${name}\nAge: ${age}\nGender: ${gender}\nMobile Number: ${phone}\nReason For Appointment: ${reasonsString}\nAppointment Date: ${formattedDate}\nTime Slot: ${time}`;
}

function redirectToWhatsApp() {
    const message = getFormattedMessage();
    const url = `https://wa.me/9094852653?text=${encodeURIComponent(message)}`;
    clearFormData(); // Clear form data after redirect
    window.open(url, '_blank');
}

function redirectToSMS() {
    const message = getFormattedMessage();
    const url = `sms:9094852653?body=${encodeURIComponent(message)}`;
    clearFormData(); // Clear form data after redirect
    window.open(url, '_blank');
}

function redirectToEmail() {
    const subject = 'Appointment Details';
    const body = getFormattedMessage();
    const url = `mailto:balavarmaclinic@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    clearFormData(); // Clear form data after redirect
    window.open(url, '_blank');
}

function redirectToCall() {
    const phoneNumber = '9094852653'; // Hardcoded phone number
    const url = `tel:${encodeURIComponent(phoneNumber)}`;
    clearFormData(); // Clear form data after redirect
    window.open(url, '_blank');
}

function clearFormData() {
    // Clear localStorage data
    localStorage.removeItem('formData');
    localStorage.removeItem('selectedSlotId');
    localStorage.removeItem('bookedSlots');
    
    // Clear form fields
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('date').value = '';

    // Uncheck all reason checkboxes
    document.querySelectorAll('input[name="reason"]').forEach(cb => cb.checked = false);
    
    // Disable communication buttons
    disableCommunicationButtons();
}

function toggleOthersInput() {
    const othersCheckbox = document.querySelector('input[name="reason"][value="Others"]');
    const othersInput = document.getElementById('othersInput');
    
    if (othersCheckbox.checked) {
        othersInput.style.display = 'inline-block';
        othersInput.focus();
    } else {
        othersInput.style.display = 'none';
        othersInput.value = ''; // Clear the input field if checkbox is unchecked
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
document.querySelectorAll('#available-slots button').forEach(button => {
    button.addEventListener('click', handleClick);
});
});

function handleClick(event) {
alert('Button clicked!');
}


document.addEventListener('DOMContentLoaded', () => {
    setDateInputMinDate();
});

function setDateInputMinDate() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}


