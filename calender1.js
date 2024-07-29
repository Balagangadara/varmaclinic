<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="floatingicon.css" rel="stylesheet">
    <script type="text/javascript" src="script.js" async></script>
    <link href="index.css" rel="stylesheet">
    
    <title>Varma Clinic</title>
     </head>
     <body>

<div class="form-container">
    <a href="index1.html" class="next-button">Calendely</a>
    <img src="images/logo.png" width="620" height="100" alt="Form Logo" />
    <h1>Book Your Appointment</h1>
         <!-- Your form fields here -->
        
    

    <div class="container">
        <!-- Common Form Fields -->
        <div class="form-group">
            <label for="name">Patient Name:</label>
            <input type="text" name="Name" class="form-control" id="name" placeholder="Your Name" required>
        </div>
        <div class="form-group">
            <label for="age">Age:</label>
            <input type="number" id="age" name="age" required min="1" max="999">
        </div>

        <div class="form-group">
            <label for="gender" style="margin-top: 20px;">Gender:</label>
            <select id="gender" name="gender" required>
                <option value="">Please Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
            </select>
        </div>

        <div class="form-group" style="margin-top: 20px;">
            <label for="phone" style="margin-top: 20px;">Mobile Number:</label>
            <input type="tel" class="form-control" name="Mobile number" id="phone" placeholder="" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');" pattern="[6-9]{1}[0-9]{9}" maxlength="10" required>
        </div>

        <div class="form-group">
            <label for="reason" style="margin-top: 20px;">Reason For Your Appointment:</label>
            <select id="reason" name="reason" required>
                <option value="">Please Select</option>
                <option value="Fever">Fever</option>
                <option value="Vomiting">Vomiting</option>
                <option value="Body pain/Joint pain">Head Ache</option>
                <option value="Diarrhoea/Dysentery">Diarrhoea/Dysentery</option>
                <option value="Stomach Pain">Stomach Pain</option>
                <option value="Body pain/Joint pain">Body pain/Joint pain</option>
                <option value="Others">Others</option>
            </select>
        </div>

        <div class="form-group">
            <label for="appointment_date" style="margin-top: 20px;">Appointment Date:</label>
            <input type="date" id="appointment_date" name="appointment_date" required>
        </div>

        <div class="form-group">
            <label for="time_slot" style="margin-top: 20px;">Time Slot:</label>
            <select id="time_slot" name="time_slot" required>
                <option value="">Please Select</option>
                <!-- ... all time slot options ... -->
                <option value="07:00">07:00</option>
                <option value="07:15">07:15</option>
                <option value="07:30">07:30</option>
                <option value="07:45">07:45</option>
                <option value="08:00">08:00</option>
               <option value="08:15">08:15</option>
                <option value="08:30">08:30</option>
                <option value="08:45">08:45</option>
                <option value="09:00">09:00</option>
                <option value="09:15">09:15</option>
                <option value="09:30">09:30</option>
                <option value="09:45">09:45</option>
                <option value="10:00">10:00</option>
                <option value="10:15">10:15</option>
                <option value="10:30">10:30</option>
                <option value="10:45">10:45</option>
                <option value="11:00">11:00</option>
                <option value="11:15">11:15</option>
                <option value="11:30">11:30</option>
                <option value="11:45">11:45</option>
                <option value="12:00">12:00</option>
                <option value="12:15">12:15</option>
                <option value="12:30">12:30</option>
                <option value="12:45">12:45</option>
                <option value="13:00">13:00</option>
                <option value="13:15">13:15</option>
                <option value="13:30">13:30</option>
                <option value="13:45">13:45</option>
                <option value="14:00">14:00</option>
                <option value="14:15">14:15</option>
                <option value="14:30">14:30</option>
                <option value="14:45">14:45</option>
                <option value="15:00">15:00</option>
                <option value="15:15">15:15</option>
                <option value="15:30">15:30</option>
                <option value="15:45">15:45</option>
                <option value="16:00">16:00</option>
                <option value="16:15">16:15</option>
                <option value="16:30">16:30</option>
                <option value="16:45">16:45</option>
                <option value="17:00">17:00</option>
                <option value="17:15">17:15</option>
                <option value="17:30">17:30</option>
                <option value="17:45">17:45</option>
                <option value="18:00">18:00</option>
                <option value="18:15">18:15</option>
                <option value="18:30">18:30</option>
                <option value="18:45">18:45</option>
                <option value="19:00">19:00</option>
                <option value="19:15">19:15</option>
                <option value="19:30">19:30</option>
                <option value="19:45">19:45</option>
                <option value="20:00">20:00</option>
                <option value="20:15">20:15</option>
                <option value="20:30">20:30</option>
                <option value="20:45">20:45</option>
                <option value="21:00">21:00</option>
                <option value="21:15">21:15</option>
                <option value="22:30">22:30</option>
                <option value="22:45">22:45</option>
             
                
            </select>
        </div>

        <!-- Form for WhatsApp -->
        <form id="submit_form_whatsapp">
            <div class="form-group">
                <button type="button" id="whatsappButton" style="margin-top: 20px;" disabled>Book an Appointment via WhatsApp</button>
            </div>
        </form>

        <!-- Form for SMS -->
        <form id="submit_form_sms">
            <div class="form-group">
                <button type="button" id="smsButton" style="margin-top: 20px;" disabled>Book an Appointment via SMS</button>
            </div>
        </form>

        <!-- Form for Email -->
        <form id="submit_form_email">
            <div class="form-group">
                <button type="button" id="emailButton" style="margin-top: 20px;" disabled>Book an Appointment via Email</button>
            </div>
        </form>

        <!-- Form for Phone Call -->
        <form id="submit_form_call">
            <div class="form-group">
                <button type="button" id="callButton" style="margin-top: 20px;" disabled>Book an Appointment via Phone Call</button>
            </div>
        </form>

        <!-- Form for Formspree -->
        <form action="https://formspree.io/f/mblrlylw" method="post" id="formspreeForm">
            <div class="form-group">
                <button type="submit" id="formspreeButton" style="margin-top: 20px; margin-bottom: 20px;" disabled>Submit via Formspree and Email</button>
            </div>
        </form>
     </div>
      
    <div class="container">
        <div class="floating-contact right">
            <a href="https://wa.me/9094852653" target="_blank">
                <img src="images/whats.png" alt="WhatsApp Icon">
            </a>
            <a href="mailto:balavarmaclinic@gmail.com?subject=Appointment%20Request" target="_blank">
                <img src="images/mail.png" alt="Email Icon">
            </a>
            <a href="sms:9094852653?body=Hello%20there!" target="_blank">
                <img src="images/message.png" alt="Message Icon">
            </a>
            <a href="tel:9094852653" target="_blank">
                <img src="images/call.png" alt="Call Icon">
            </a>
        </div>
    </div>
<script>   
 function setDateLimits() {
        const today = new Date();
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 5);

        const minDateString = today.toISOString().split('T')[0];
        const maxDateString = maxDate.toISOString().split('T')[0];

        const dateInput = document.getElementById('appointment_date');
        dateInput.setAttribute('min', minDateString);
        dateInput.setAttribute('max', maxDateString);
    }

    document.addEventListener('DOMContentLoaded', setDateLimits);
  

      
</script>

     </body>


</html>
