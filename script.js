// Add this function to manage the state of communication buttons
function updateCommunicationButtons() {
    const selectedSlotId = localStorage.getItem('selectedSlotIds');
    if (selectedSlotId && selectedSlotId.length > 0) {
        enableCommunicationButtons();
    } else {
        disableCommunicationButtons();
    }
}

async function loadSlots() {
    const dateInput = document.getElementById('date').value;
    if (!dateInput) {
        alert('Please select a date.');
        return;
    }

    const formattedDate = formatDateToYYYYMMDD(dateInput);

    try {
        const response = await fetch('https://raw.githubusercontent.com/Balagangadara/timeblock/main/time.json');
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);

        const data = await response.json();
        const dayData = data[formattedDate];

        if (!dayData || !Array.isArray(dayData)) {
            document.getElementById('available-slots').innerHTML = '<p>No time slots available for this date.</p>';
            return;
        }

        displaySlots(dayData);

    } catch (error) {
        console.error('Error loading slots:', error);
        document.getElementById('available-slots').innerHTML = `<p>Error loading slots: ${error.message}. Please try again later.</p>`;
    }
}

function displaySlots(slots) {
    const slotsContainer = document.getElementById('available-slots');
    slotsContainer.innerHTML = ''; // Clear existing slots

    // Create and append headings
    const morningHeading = document.createElement('h3');
    morningHeading.textContent = 'Morning Slots';
    const eveningHeading = document.createElement('h3');
    eveningHeading.textContent = 'Evening Slots';

    // Create containers for each slot type
    const morningContainer = document.createElement('div');
    morningContainer.className = 'slot-container'; // Add class for grid layout
    const eveningContainer = document.createElement('div');
    eveningContainer.className = 'slot-container'; // Add class for grid layout

    // Append headings and containers to the main container
    slotsContainer.appendChild(morningHeading);
    slotsContainer.appendChild(morningContainer);
    slotsContainer.appendChild(eveningHeading);
    slotsContainer.appendChild(eveningContainer);

    const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '{}');
    const date = formatDateToYYYYMMDD(document.getElementById('date').value);
    const selectedSlotId = JSON.parse(localStorage.getItem('selectedSlotIds') || '[]')[0];

    slots.forEach(slot => {
        const button = createSlotButton(slot, bookedSlots[date] || [], selectedSlotId);
        if (isMorning(slot.time)) {
            morningContainer.appendChild(button);
        } else {
            eveningContainer.appendChild(button);
        }
    });

    // Update the state of communication buttons based on the selected slot
    updateCommunicationButtons();
}

function isMorning(time) {
    const [hour] = time.split(':').map(Number);
    return hour < 12; // Assume hours before noon are morning slots
}

function handleSlotClick(slotId, slotTime) {
    const dateInput = document.getElementById('date').value;
    if (!dateInput) {
        alert('Please select a date.');
        return;
    }

    const formattedDate = formatDateToYYYYMMDD(dateInput);

    let bookedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '{}');
    bookedSlots[formattedDate] = bookedSlots[formattedDate] || [];
    let selectedSlotIds = JSON.parse(localStorage.getItem('selectedSlotIds') || '[]');

    if (selectedSlotIds.includes(slotId)) {
        // Deselect slot
        selectedSlotIds = selectedSlotIds.filter(id => id !== slotId);
    } else {
        // Check if the slot is in the past
        if (isPastSlot(slotTime, dateInput)) {
            alert('This slot is in the past and cannot be selected.');
            return;
        }

        // Select slot
        selectedSlotIds = [slotId];
    }

    localStorage.setItem('selectedSlotIds', JSON.stringify(selectedSlotIds));
    saveFormData(); // Save form data whenever a slot is selected
    updateSlotButtons(formattedDate, selectedSlotIds[0] || null, slotTime); // Update button states
    updateButtonStates(); // Update button states after slot selection

    // Update the state of communication buttons based on the selected slot
    updateCommunicationButtons();
}

function isPastSlot(slotTime, dateInput) {
    const slotDateTime = new Date(`${dateInput} ${slotTime}`);
    const now = new Date();
    return slotDateTime < now;
}

function createSlotButton(slot, bookedSlots, selectedSlotId) {
    const slotButton = document.createElement('button');
    const isBooked = slot.booked || bookedSlots.includes(slot.id);
    const isPast = isPastSlot(slot.time, document.getElementById('date').value);

    // Set classes based on slot status
    if (isPast) {
        slotButton.className = 'past'; // Red color for past slots
        slotButton.disabled = true; // Disable past slots
    } else if (isBooked) {
        slotButton.className = 'booked'; // Grey color for booked slots
        slotButton.disabled = true;
    } else {
        slotButton.className = 'available'; // Blue color for available slots
        slotButton.disabled = false;
    }

    slotButton.textContent = slot.time;
    slotButton.dataset.slotId = slot.id;
    slotButton.dataset.slotTime = slot.time;

    slotButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (!isBooked && !isPast) {
            handleSlotClick(slot.id, slot.time);
        }
    });

    // Highlight if it's the selected slot
    if (slot.id === selectedSlotId) {
        slotButton.classList.add('selected');
    }

    return slotButton;
}

function updateSlotButtons(date, selectedSlotId, slotTime) {
    const slots = document.querySelectorAll('#available-slots .slot button');
    const selectedSlotIds = JSON.parse(localStorage.getItem('selectedSlotIds') || '[]');
    const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '{}');
    const dateBookedSlots = bookedSlots[date] || [];

    slots.forEach(button => {
        const buttonId = button.dataset.slotId;
        const isBooked = dateBookedSlots.includes(parseInt(buttonId, 10));
        const isSelected = selectedSlotIds.includes(parseInt(buttonId, 10));
        const isPast = isPastSlot(button.dataset.slotTime, date);

        if (isPast) {
            button.className = 'past'; // Red for past slots
        } else if (buttonId === selectedSlotId) {
            button.className = 'selected'; // Dark grey for the selected slot
        } else if (isBooked) {
            button.className = 'booked'; // Grey for booked slots
        } else if (isSelected) {
            button.className = 'selected'; // Selected slot styling
        } else {
            button.className = 'available'; // Blue for available slots
        }
        button.disabled = isBooked || isPast; // Disable past and booked slots
    });
}

function updateButtonStates() {
    // Reload the slots to update button states after selection
    loadSlots();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('date').addEventListener('change', loadSlots);
    document.getElementById('finalizeBooking').addEventListener('click', finalizeBooking);
    loadFormData(); // Load form data when the page loads

    // Initialize communication buttons state
    updateCommunicationButtons();
});

function setDateInputMinDate() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

function isFormComplete() {
    const name = document.getElementById('name')?.value.trim();
    const age = document.getElementById('age')?.value.trim();
    const gender = document.getElementById('gender')?.value;
    const phone = document.getElementById('phone')?.value.trim();
    const reasons = Array.from(document.querySelectorAll('input[name="reason"]:checked')).map(cb => cb.value);
    const date = document.getElementById('date')?.value;
    const selectedSlot = localStorage.getItem('selectedSlotId');

    return name.length >= 3 && age && gender && phone.length >= 10 && reasons.length > 0 && date && selectedSlot;
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
    updateCommunicationButtons(); // Update communication button states based on form data
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
    const slotId = JSON.parse(localStorage.getItem('selectedSlotIds') || '[]')[0];
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

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getFormattedMessage() {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (!formData) {
        alert('Form data is missing.');
        return '';
    }

    const { name, age, gender, phone, reasons, date } = formData;
    const formattedDate = formatDateToDDMMYYYY(date);
    const selectedSlotIds = JSON.parse(localStorage.getItem('selectedSlotIds') || '[]');
    const timeSlots = selectedSlotIds.map(id => {
        const button = document.querySelector(`#available-slots button[data-slot-id="${id}"]`);
        return button ? button.dataset.slotTime : '';
    }).join(', ');

    // Capitalize the first letter of name
    const capitalizedName = capitalizeFirstLetter(name);

    let reasonsString = reasons.filter(reason => reason !== 'Others').join(', ');

    // Include "Others" input value if checkbox is checked
    const othersInput = document.getElementById('othersInput');
    const othersCheckbox = document.querySelector('input[name="reason"][value="Others"]');
    if (othersCheckbox.checked && othersInput.value.trim()) {
        const capitalizedOthersInput = capitalizeFirstLetter(othersInput.value.trim());
        reasonsString += (reasonsString ? ', ' : '') + capitalizedOthersInput;
    }

    return `Name: ${capitalizedName}\nAge: ${age}\nGender: ${gender}\nMobile Number: ${phone}\nReason For Appointment: ${reasonsString}\nAppointment Date: ${formattedDate}\nTime Slots: ${timeSlots}`;
}

function redirectToWhatsApp() {
    const message = getFormattedMessage();
    const url = `https://wa.me/9962060702?text=${encodeURIComponent(message)}`;
    clearFormData(); // Clear form data after redirect
    window.open(url, '_blank');
}

function redirectToSMS() {
    const message = getFormattedMessage();
    const url = `sms:9962060702?body=${encodeURIComponent(message)}`;
    clearFormData(); // Clear form data after redirect
    window.open(url, '_blank');
}

function redirectToEmail() {
    const subject = 'Appointment Details';
    const body = getFormattedMessage();
    const url = `mailto:vnhdoctor@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    clearFormData(); // Clear form data after redirect
    window.open(url, '_blank');
}

function redirectToCall() {
    const phoneNumber = '9962060702'; // Hardcoded phone number
    const url = `tel:${encodeURIComponent(phoneNumber)}`;
    clearFormData(); // Clear form data after redirect
    window.open(url, '_blank');
}

function clearFormData() {
    // Clear localStorage data
    localStorage.removeItem('formData');
    localStorage.removeItem('selectedSlotIds');
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

// Make sure to bind this function to appropriate event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('date').addEventListener('change', loadSlots);
    document.getElementById('finalizeBooking').addEventListener('click', finalizeBooking);
    loadFormData(); // Load form data when the page loads
    setDateInputMinDate(); // Ensure date input minimum date is set

    // Initialize communication buttons state
    updateCommunicationButtons();
});
document.addEventListener('DOMContentLoaded', () => {
    setDateInputMinDate();
    // Any other initialization code
});
