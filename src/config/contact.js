export const CONTACT=Object.freeze({timeSlots:['Morning','Afternoon','Evening'],requestTimeout:15000,shakeDuration:.45,confettiCount:18});
export const appointmentRules={
  fullName:{required:'Please enter your name.',minLength:{value:2,message:'Please use at least two characters.'},maxLength:{value:100,message:'Please keep your name under 100 characters.'},validate:value=>value.trim().length>=2||'Please enter your name.'},
  phone:{required:'Please enter your phone number.',pattern:{value:/^[0-9]{10}$/,message:'Please enter exactly 10 digits, without +91.'}},
  email:{pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:'Please enter a valid email address.'}},
  service:{required:'Please choose a treatment or consultation.'},
  appointmentDate:{required:'Please choose your preferred date.',validate:value=>{const today=new Date();today.setHours(0,0,0,0);return new Date(value+'T00:00:00')>=today||'Please choose today or a future date.';}},
  timeSlot:{required:'Please choose a preferred time.'},
  message:{maxLength:{value:2000,message:'Please keep your message under 2,000 characters.'}},
  consent:{required:'Please agree so the clinic can contact you about your appointment.'},
};
