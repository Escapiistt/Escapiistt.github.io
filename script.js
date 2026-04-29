// ── БУРГЕР-МЕНЮ ──
const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav');
if (burger && navMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

// ── АКТИВНАЯ ССЫЛКА ──
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(a => {
  const href = a.getAttribute('href').split('/').pop();
  if (href === currentPage) a.classList.add('active');
});

// ── ТЕСТ ──
function initQuiz(questions) {
  const wrap = document.getElementById('quiz');
  if (!wrap) return;

  let score = 0;
  let answered = 0;
  const total = questions.length;

  questions.forEach((q, qi) => {
    const block = document.createElement('div');
    block.className = 'quiz-question';
    block.innerHTML = `
      <div class="q-num">Вопрос ${qi + 1} из ${total}</div>
      <div class="q-text">${q.q}</div>
      <div class="q-options">
        ${q.options.map((opt, oi) => `
          <div class="q-option" data-qi="${qi}" data-oi="${oi}">
            <span class="q-dot"></span>
            <span>${opt}</span>
          </div>
        `).join('')}
      </div>
      <div class="q-explain" id="explain-${qi}">${q.explain}</div>
    `;
    wrap.appendChild(block);
  });

  // Обработка кликов
  wrap.addEventListener('click', e => {
    const opt = e.target.closest('.q-option');
    if (!opt) return;
    const qi = +opt.dataset.qi;
    const oi = +opt.dataset.oi;
    const block = opt.closest('.quiz-question');
    if (block.classList.contains('answered')) return;

    block.classList.add('answered');
    const opts = block.querySelectorAll('.q-option');
    const isCorrect = oi === questions[qi].correct;

    opts[questions[qi].correct].classList.add('show-correct');
    if (isCorrect) {
      opt.classList.add('correct');
      score++;
    } else {
      opt.classList.add('wrong');
    }

    document.getElementById(`explain-${qi}`).classList.add('show');
    answered++;
    if (answered === total) showResult();
  });

  function showResult() {
    const pct = Math.round(score / total * 100);
    let label, desc;
    if (pct >= 90) {
      label = '🏆 Эксперт по ИБ!';
      desc = 'Отлично! Ты отлично разбираешься в информационной безопасности. Продолжай в том же духе и делись знаниями с другими.';
    } else if (pct >= 70) {
      label = '✅ Хорошая база';
      desc = 'Молодец! Основы ты знаешь, но есть моменты, которые стоит повторить. Перечитай разделы, где допустил ошибки.';
    } else if (pct >= 50) {
      label = '📚 Нужно подучить';
      desc = 'Неплохое начало, но знаний пока недостаточно для уверенной защиты в сети. Рекомендуем перечитать материал.';
    } else {
      label = '⚠️ Высокий риск';
      desc = 'Твои знания об ИБ пока минимальны. Это опасно — злоумышленники именно на это и рассчитывают. Обязательно изучи весь сайт!';
    }

    const result = document.getElementById('quiz-result');
    result.innerHTML = `
      <div class="result-score">${score}/${total}</div>
      <div class="result-label">${label}</div>
      <div class="result-desc">${desc}</div>
      <button class="btn btn-outline" onclick="location.reload()">Пройти ещё раз</button>
    `;
    result.classList.add('show');
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
