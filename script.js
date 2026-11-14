const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

const guideContent = document.querySelector('#assistant-content');
const guideProgress = document.querySelector('.assistant-progress span');
const answers = {};
let step = 0;
const questions = [
  { key: 'study', prompt: 'What best describes what you’re studying or doing now?', options: ['School student', 'College / university', 'Working', 'Looking for my next step', 'Something else'] },
  { key: 'interest', prompt: 'Which course area sounds most interesting to you?', options: ['Accounting & Gulf accounting', 'Computer & office skills', 'Software & web development', 'AI & data', 'Multimedia & graphic design', 'Administration', 'Fashion design', 'Cybersecurity & networking', 'I’m not sure yet'] },
  { key: 'goal', prompt: 'What would you like help with first?', options: ['Choosing a course', 'Certification or testing', 'Building job skills', 'I’d like to talk it through'] }
];
const courseSuggestions = {
  'Accounting & Gulf accounting': 'Accounting Session, Professional Accounting, and Professional Gulf Accounting with SAP S/4 HANA',
  'Computer & office skills': 'AI Integrated Basic Computer with MS Office, Cisco Certified Computer Hardware and Networking, Office Administration, or Business Administration',
  'Software & web development': 'Python Full Stack Developer, Flutter Mobile App Developer, MERN Stack, AI Web Development, or Basic Web Development',
  'AI & data': 'Future X — Building AI Models, AI Web Development, or Data Analysis',
  'Multimedia & graphic design': 'Digital Marketing with Graphic Designing, Adobe Certified Professional Graphic Designer, UI/UX Designing, or Video Editing',
  'Administration': 'Office Administration or Business Administration',
  'Fashion design': 'Fashion Designing',
  'Cybersecurity & networking': 'Certified Ethical Hacker or Cisco Certified Computer Hardware and Networking',
  'I’m not sure yet': 'a conversation with our team to find a suitable course from the GTEC list'
};
function renderQuestion() {
  const item = questions[step];
  guideProgress.style.width = `${(step / questions.length) * 100}%`;
  guideContent.innerHTML = `<div class="guide-step">QUESTION 0${step + 1} / 0${questions.length}</div><h3 class="guide-question">${item.prompt}</h3><div class="guide-options">${item.options.map((option) => `<button class="guide-option" type="button" data-answer="${option}">${option}<span>↗</span></button>`).join('')}</div>`;
  guideContent.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', () => {
    answers[item.key] = button.dataset.answer;
    step += 1;
    if (step < questions.length) renderQuestion();
    else renderContactForm();
  }));
}
function renderContactForm() {
  guideProgress.style.width = '100%';
  guideContent.innerHTML = `<div class="guide-step">YOUR STARTING POINT</div><h3 class="guide-question">Courses to explore: <span>${courseSuggestions[answers.interest]}</span></h3><p class="guide-result-note">You’re studying/doing: ${answers.study}. Your first goal: ${answers.goal}. These course ideas are based on your interests; ask GTEC to confirm current courses and availability.</p><form class="guide-form" id="lead-form"><label>Your name<input name="name" autocomplete="name" required placeholder="How should we address you?"></label><label>WhatsApp number<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="Your number, including area code"></label><label class="guide-consent"><input name="consent" type="checkbox" required><span>I agree to share these details with GTEC Kunnumpuram so the team can respond to my enquiry.</span></label><button class="button button-primary guide-send" type="submit">Send enquiry on WhatsApp <span>↗</span></button></form><button class="guide-back" type="button">← Change my answers</button>`;
  guideContent.querySelector('.guide-back').addEventListener('click', () => { step = 0; renderQuestion(); });
  guideContent.querySelector('#lead-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      'Hello GTEC Kunnumpuram, I would like guidance about learning options.',
      `Name: ${form.get('name')}`,
      `WhatsApp: ${form.get('phone')}`,
      `Currently studying/doing: ${answers.study}`,
      `Interested in: ${answers.interest}`,
      `Looking for: ${answers.goal}`,
      `Courses to discuss: ${courseSuggestions[answers.interest]}`
    ].join('\n');
    window.open(`https://wa.me/919946111944?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    guideContent.innerHTML = '<div class="guide-complete"><span>✓</span><h3>Enquiry ready to send</h3><p>WhatsApp opened with your answers. Tap Send there to share them with GTEC.</p><button class="guide-back" type="button">Start another enquiry</button></div>';
    guideContent.querySelector('.guide-back').addEventListener('click', resetGuide);
  });
}
function resetGuide() { step = 0; Object.keys(answers).forEach((key) => delete answers[key]); renderQuestion(); }
document.querySelector('.guide-reset').addEventListener('click', resetGuide);
renderQuestion();

// Floating course assistant
const botDock = document.querySelector('#bot-dock');
const botPanel = document.querySelector('#bot-panel');
const botLaunch = document.querySelector('#bot-launch');
const botMessages = document.querySelector('#bot-messages');
const botAnswers = {};
let botStep = 0;
const botQuestions = [
  { key: 'study', prompt: 'First, what best describes what you’re studying or doing now?', options: ['School student', 'College / university', 'Working', 'Looking for my next step', 'Something else'] },
  { key: 'interest', prompt: 'What kind of course are you curious about?', options: Object.keys(courseSuggestions) },
  { key: 'goal', prompt: 'What would you like help with?', options: ['Choosing a course', 'Certification or testing', 'Building job skills', 'I’d like to talk it through'] }
];
function addBotMessage(text, sender = 'assistant') {
  const bubble = document.createElement('div');
  bubble.className = `bot-message ${sender === 'visitor' ? 'visitor-message' : 'assistant-message'}`;
  bubble.textContent = text;
  botMessages.appendChild(bubble);
  botMessages.scrollTop = botMessages.scrollHeight;
}
function askBotQuestion() {
  const question = botQuestions[botStep];
  if (!question) return showBotContactForm();
  addBotMessage(question.prompt);
  const choices = document.createElement('div');
  choices.className = 'bot-choices';
  question.options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'bot-choice';
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => {
      botAnswers[question.key] = option;
      addBotMessage(option, 'visitor');
      choices.remove();
      botStep += 1;
      window.setTimeout(askBotQuestion, 250);
    });
    choices.appendChild(button);
  });
  botMessages.appendChild(choices);
  botMessages.scrollTop = botMessages.scrollHeight;
}
function showBotContactForm() {
  addBotMessage(`For ${botAnswers.interest}, you could explore: ${courseSuggestions[botAnswers.interest]}. What name and WhatsApp number should GTEC use to reply?`);
  const form = document.createElement('form');
  form.className = 'bot-lead-form';
  form.innerHTML = '<label>Name<input name="name" autocomplete="name" required placeholder="Your name"></label><label>WhatsApp number<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="Your number"></label><label class="bot-consent"><input name="consent" type="checkbox" required><span>I agree to share these details with GTEC Kunnumpuram so the team can reply to my enquiry.</span></label><button class="bot-send" type="submit">Continue to WhatsApp <span>↗</span></button>';
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const details = new FormData(form);
    const message = [
      'Hello GTEC Kunnumpuram, I would like guidance about learning options.',
      `Name: ${details.get('name')}`,
      `WhatsApp: ${details.get('phone')}`,
      `Currently studying/doing: ${botAnswers.study}`,
      `Interested in: ${botAnswers.interest}`,
      `Looking for: ${botAnswers.goal}`,
      `Courses to discuss: ${courseSuggestions[botAnswers.interest]}`
    ].join('\n');
    window.open(`https://wa.me/919946111944?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    form.remove();
    addBotMessage('WhatsApp opened with your enquiry. Tap Send there to share your answers with GTEC.');
    const restart = document.createElement('button');
    restart.type = 'button';
    restart.className = 'bot-restart';
    restart.textContent = 'Start again';
    restart.addEventListener('click', resetBot);
    botMessages.appendChild(restart);
  });
  botMessages.appendChild(form);
  botMessages.scrollTop = botMessages.scrollHeight;
}
function resetBot() {
  botMessages.replaceChildren();
  Object.keys(botAnswers).forEach((key) => delete botAnswers[key]);
  botStep = 0;
  askBotQuestion();
}
function setBotOpen(open) {
  botPanel.hidden = !open;
  botPanel.setAttribute('aria-hidden', String(!open));
  botLaunch.setAttribute('aria-expanded', String(open));
  botLaunch.setAttribute('aria-label', open ? 'Close GTEC course assistant' : 'Open GTEC course assistant');
  botDock.classList.toggle('is-open', open);
  if (open && botMessages.childElementCount === 0) {
    addBotMessage('Hi! I can help you explore GTEC courses. I’ll ask a few quick questions.');
    window.setTimeout(askBotQuestion, 250);
  }
}
botLaunch.addEventListener('click', () => setBotOpen(botPanel.hidden));
botDock.querySelector('.bot-close').addEventListener('click', () => setBotOpen(false));

const partnersSection = document.querySelector('.partners');
if ('IntersectionObserver' in window && partnersSection) {
  const partnerObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      partnersSection.classList.add('logos-visible');
      partnerObserver.disconnect();
    }
  }, { threshold: 0.12 });
  partnerObserver.observe(partnersSection);
} else if (partnersSection) {
  partnersSection.classList.add('logos-visible');
}



