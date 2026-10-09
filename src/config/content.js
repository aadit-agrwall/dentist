import { ShieldCheck, Smile, Sparkles, Heart, Stethoscope, Baby } from 'lucide-react';
export const NAV_LINKS=[['home','Home'],['services','Treatments'],['process','Your Visit'],['results','Our Care'],['faq','FAQ'],['contact','Book a Visit']];
export const SERVICES=[
  {id:'general',icon:ShieldCheck,kicker:'Your everyday dental care',title:'General Dentistry',description:'A welcoming place for dental check-ups, cleaning, and conversations about looking after your smile.',detail:'At your visit, the dentist can review your concerns and explain which examinations or care options are appropriate for you.',tag:'Check-ups & cleaning'},
  {id:'implants',icon:Stethoscope,kicker:'Explore your options',title:'Dental Implants',description:'Discuss options for replacing missing teeth with a dentist who takes time to understand your needs.',detail:'Suitability, treatment stages, alternatives, and costs are discussed after an individual clinical assessment.',tag:'Personal consultation'},
  {id:'aligners',icon:Smile,kicker:'A smile that feels like you',title:'Braces & Aligners',description:'Explore teeth-straightening options and a plan tailored to your smile and day-to-day life.',detail:'Your dentist can explain the available orthodontic options, their suitability, and what follow-up care may involve.',tag:'Smile alignment'},
  {id:'root-canal',icon:Heart,kicker:'Thoughtful treatment planning',title:'Root Canal Care',description:'Speak with the dental team about tooth concerns and understand your treatment options before deciding.',detail:'An examination helps the dentist explain whether root canal treatment or another approach is appropriate for your tooth.',tag:'Tooth-focused care'},
  {id:'whitening',icon:Sparkles,kicker:'A brighter conversation',title:'Teeth Whitening',description:'Find out about professionally supervised whitening options and what may suit your smile.',detail:'Discuss your goals, suitability, possible sensitivity, and expected results with the dentist. Results vary between individuals.',tag:'Cosmetic dentistry'},
  {id:'children',icon:Baby,kicker:'Little smiles, warm welcomes',title:'Children’s Dentistry',description:'A friendly introduction to dental visits, with time for children and parents to ask questions.',detail:'The team can discuss age-appropriate examinations, preventive care, and ways to make future visits feel familiar.',tag:'Family dental care'},
];
export const PROCESS=[
  {title:'Meet',note:'A warm first welcome',text:'Tell us what brings you in. Share your questions and any concerns about your dental visit.'},
  {title:'Understand',note:'Clarity before decisions',text:'Your dentist assesses your needs and explains the available options in language you can understand.'},
  {title:'Care',note:'A plan made with you',text:'Discuss the proposed treatment, costs, and next steps before moving forward with your care.'},
  {title:'Follow up',note:'Care beyond the chair',text:'Receive guidance from your dental team and discuss the follow-up visits appropriate for your plan.'},
];
// Fictional review copy for a presentation demo. Replace with consented, verified patient reviews.
export const TESTIMONIALS=[
  {name:'Patient A',clinic:'Sample patient story · Demo',initials:'A',quote:'The dentist took time to explain the visit and answered my questions. I appreciated being included in the conversation.'},
  {name:'Patient B',clinic:'Sample patient story · Demo',initials:'B',quote:'A friendly welcome and clear explanations made the appointment feel much more familiar.'},
  {name:'Patient C',clinic:'Sample patient story · Demo',initials:'C',quote:'We had space to ask questions about our child’s visit. The team explained the next steps clearly.'},
  {name:'Patient D',clinic:'Sample patient story · Demo',initials:'D',quote:'I liked being able to discuss the options and costs before making a decision about my care.'},
];
export const FAQS=[
  {title:'How do I book an appointment?',content:'Use the appointment request form, call the clinic, or send a WhatsApp message. The team will contact you to confirm availability. An online request is not a confirmed appointment.'},
  {title:'What happens at my first visit?',content:'You can discuss your concerns and relevant medical or dental history with the dentist. The dentist will explain the examination and any recommended next steps.'},
  {title:'Can I discuss costs before treatment?',content:'Yes. Ask the team for an explanation of the proposed treatment, alternatives, and associated costs before proceeding.'},
  {title:'Do you see children and families?',content:'This demo presents family dental care, including children’s visits. Replace the treatment list with the services your clinic actually provides before publishing.'},
  {title:'I feel nervous about dental visits. Can I let you know?',content:'Please tell the team when requesting your visit. You can share your concerns and discuss how the appointment can be approached with you.'},
  {title:'Can I ask about braces, aligners, or implants?',content:'You can request a consultation to discuss your goals. The dentist will explain which options may be suitable after assessing your individual needs.'},
];
export const DEMO_NOTICE='Presentation demo: replace the clinic profile, treatment list, reviews, address, and contact details with verified information before publishing.';
