
/* =====================================================
   EDULAB - SISTEMA COMPLETO
   Aprende. Experimenta. Avanza.
   ===================================================== */


/* =====================================================
   1. NAVEGACIÓN PRINCIPAL
   ===================================================== */

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".page-section");
const currentPage = document.getElementById("currentPage");

const pageNames = {
    inicio: "Inicio",
    planes: "Planes de estudio",
    aprender: "Aprender",
    laboratorio: "Laboratorio",
    juegos: "Juegos",
    retos: "Retos",
    progreso: "Mi progreso",
    ods: "ODS 4"
};

function showSection(sectionId) {
    sections.forEach(section => section.classList.remove("active"));

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) selectedSection.classList.add("active");

    navItems.forEach(item => item.classList.remove("active"));

    const selectedNav = document.querySelector(
        `.nav-item[data-section="${sectionId}"]`
    );
    if (selectedNav) selectedNav.classList.add("active");

    if (currentPage && pageNames[sectionId]) {
        currentPage.textContent = pageNames[sectionId];
    }

    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("open");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

navItems.forEach(item => {
    item.addEventListener("click", () => {
        showSection(item.dataset.section);
    });
});

document.querySelectorAll("[data-go-section]").forEach(button => {
    button.addEventListener("click", () => {
        showSection(button.dataset.goSection);
    });
});

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}

const themeButton = document.getElementById("themeButton");

if (themeButton) {
    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        themeButton.textContent =
            document.body.classList.contains("dark-mode") ? "🌙" : "☀️";
    });
}


/* =====================================================
   2. GUARDAR EL PROGRESO
   ===================================================== */

const STORAGE_KEY = "edulab_progreso_v1";

function loadProgress() {
    const initial = {
        points: 0,
        lessons: [],
        experiments: [],
        games: [],
        challenges: []
    };

    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!saved || typeof saved !== "object") return initial;

        return {
            points: Number(saved.points) || 0,
            lessons: Array.isArray(saved.lessons) ? saved.lessons : [],
            experiments: Array.isArray(saved.experiments) ? saved.experiments : [],
            games: Array.isArray(saved.games) ? saved.games : [],
            challenges: Array.isArray(saved.challenges) ? saved.challenges : []
        };
    } catch (error) {
        return initial;
    }
}

let progress = loadProgress();

function saveProgress() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
        console.warn("No se pudo guardar el progreso en este navegador.");
    }

    updateProgressUI();
}

function addPoints(amount) {
    progress.points += amount;
    saveProgress();
}

function completeOnce(listName, itemId, pointsAwarded) {
    if (!progress[listName].includes(itemId)) {
        progress[listName].push(itemId);
        progress.points += pointsAwarded;
        saveProgress();
        return true;
    }

    saveProgress();
    return false;
}


/* =====================================================
   3. DATOS DE LAS LECCIONES
   ===================================================== */

const lessons = {
    operaciones: {
        subject: "Matemáticas",
        title: "Operaciones básicas",
        explanation: "Las operaciones básicas son sumar, restar, multiplicar y dividir. Sirven para resolver problemas de la vida diaria.",
        formula: "Suma, resta, multiplicación y división",
        example: "Ejemplo: 8 + 4 = 12. También, 12 ÷ 3 = 4.",
        tip: "Resuelve primero los paréntesis y después las demás operaciones."
    },

    algebra: {
        subject: "Matemáticas",
        title: "Álgebra",
        explanation: "El álgebra utiliza letras para representar números que no conocemos o que pueden cambiar.",
        formula: "x + a = b",
        example: "Si x + 3 = 8, entonces x = 5.",
        tip: "Para encontrar la incógnita, realiza la operación contraria."
    },

    ecuaciones: {
        subject: "Matemáticas",
        title: "Ecuaciones",
        explanation: "Una ecuación es una igualdad que contiene uno o más valores desconocidos. Resolverla significa encontrar esos valores.",
        formula: "2x + 4 = 10",
        example: "Restamos 4: 2x = 6. Dividimos entre 2: x = 3.",
        tip: "Lo que haces en un lado de la igualdad también debes hacerlo en el otro."
    },

    funciones: {
        subject: "Matemáticas",
        title: "Funciones matemáticas",
        explanation: "Una función relaciona un valor de entrada con un resultado. Podemos representarla con una fórmula, una tabla o una gráfica.",
        formula: "y = 2x + 3",
        example: "Si x = 4, entonces y = 2(4) + 3 = 11.",
        tip: "Reemplaza la x por el valor que te dan y calcula con cuidado."
    },

    geometria: {
        subject: "Matemáticas",
        title: "Geometría",
        explanation: "La geometría estudia las figuras, sus lados, sus ángulos, sus áreas y sus volúmenes.",
        formula: "Área del rectángulo = base × altura",
        example: "Un rectángulo de base 5 cm y altura 3 cm tiene un área de 15 cm².",
        tip: "Revisa las unidades y distingue el área del perímetro."
    },

    estadistica: {
        subject: "Matemáticas",
        title: "Estadística",
        explanation: "La estadística permite organizar e interpretar datos usando tablas, gráficas y medidas como la media.",
        formula: "Media = suma de los datos ÷ cantidad de datos",
        example: "La media de 2, 4 y 6 es (2 + 4 + 6) ÷ 3 = 4.",
        tip: "Suma todos los datos antes de dividir por la cantidad."
    },

    movimiento: {
        subject: "Física",
        title: "Movimiento y velocidad",
        explanation: "Un objeto está en movimiento cuando cambia de posición con respecto a un punto de referencia. La velocidad relaciona la distancia recorrida con el tiempo.",
        formula: "v = d ÷ t",
        example: "Si recorres 100 metros en 10 segundos, tu rapidez media es 10 m/s.",
        tip: "Usa unidades compatibles: metros y segundos para obtener m/s."
    },

    fuerza: {
        subject: "Física",
        title: "Fuerza",
        explanation: "Una fuerza es un empuje o un tirón. Puede cambiar el movimiento de un objeto o deformarlo.",
        formula: "F = m × a",
        example: "Una masa de 2 kg con una aceleración de 3 m/s² necesita una fuerza neta de 6 N.",
        tip: "La fuerza se mide en newtons (N)."
    },

    gravedad: {
        subject: "Física",
        title: "Gravedad",
        explanation: "La gravedad es una interacción de atracción entre objetos que tienen masa. En la Tierra, hace que los objetos caigan hacia el suelo.",
        formula: "Peso = masa × gravedad",
        example: "Para una masa de 2 kg en la Tierra, el peso aproximado es 2 × 9,8 = 19,6 N.",
        tip: "La masa se mide en kilogramos y el peso en newtons."
    },

    energia: {
        subject: "Física",
        title: "Energía",
        explanation: "La energía permite que ocurran cambios y se realicen actividades. Puede ser cinética, potencial, térmica, eléctrica y de otros tipos.",
        formula: "Energía cinética: Ec = ½mv²",
        example: "Un objeto en movimiento tiene energía cinética. Si aumenta su velocidad, aumenta esa energía.",
        tip: "Identifica qué tipo de energía aparece en cada situación."
    },

    trabajo: {
        subject: "Física",
        title: "Trabajo mecánico",
        explanation: "En física, hay trabajo mecánico cuando una fuerza produce un desplazamiento en la dirección de esa fuerza.",
        formula: "W = F × d",
        example: "Una fuerza de 10 N que desplaza un objeto 2 m en la misma dirección realiza 20 J de trabajo.",
        tip: "El trabajo se mide en julios (J). La fórmula sencilla supone que fuerza y desplazamiento tienen la misma dirección."
    },

    ondas: {
        subject: "Física",
        title: "Ondas y sonido",
        explanation: "Las ondas transportan energía de un lugar a otro. El sonido es una onda mecánica que necesita un medio para propagarse.",
        formula: "v = λ × f",
        example: "Si una onda tiene longitud de onda de 2 m y frecuencia de 3 Hz, su rapidez es 6 m/s.",
        tip: "La frecuencia se mide en hercios (Hz) y la longitud de onda en metros."
    },

    "reto-matematicas": {
        subject: "Reto de Matemáticas",
        title: "Reto matemático",
        explanation: "Pon a prueba tus conocimientos de operaciones, álgebra y funciones.",
        formula: "Piensa paso a paso",
        example: "Si 3x = 18, entonces x = 6.",
        tip: "Intenta resolver el reto antes de revisar la respuesta."
    },

    "reto-fisica": {
        subject: "Reto de Física",
        title: "Reto de Física",
        explanation: "Demuestra lo que sabes sobre velocidad, fuerzas y energía.",
        formula: "v = d ÷ t  |  F = m × a",
        example: "Si un objeto recorre 60 m en 5 s, su rapidez media es 12 m/s.",
        tip: "Escribe los datos, escoge la fórmula y reemplaza los valores."
    }
};


/* =====================================================
   4. VENTANA DE LAS LECCIONES
   ===================================================== */

const lessonModal = document.getElementById("lessonModal");
let currentLessonId = null;

function openLesson(lessonId) {
    const lesson = lessons[lessonId];

    if (!lesson) {
        showToast("Lección no disponible", "Esta lección todavía no está configurada.", "⚠️");
        return;
    }

    currentLessonId = lessonId;

    const fields = {
        modalSubject: lesson.subject,
        modalTitle: lesson.title,
        modalExplanation: lesson.explanation,
        modalFormula: lesson.formula,
        modalExample: lesson.example,
        modalTip: lesson.tip
    };

    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });

    if (lessonModal) lessonModal.classList.add("active");

    const completeButton = document.getElementById("completeLessonButton");

    if (completeButton) {
        completeButton.textContent = progress.lessons.includes(lessonId)
            ? "Lección completada ✓"
            : "Marcar como completada";
    }
}

function closeLesson() {
    if (lessonModal) lessonModal.classList.remove("active");
}

document.querySelectorAll("[data-open-lesson]").forEach(button => {
    button.addEventListener("click", () => {
        openLesson(button.dataset.openLesson);
    });
});

document.querySelectorAll("[data-lesson]").forEach(button => {
    button.addEventListener("click", () => {
        openLesson(button.dataset.lesson);
    });
});

const closeLessonButton = document.getElementById("closeLessonModal");

if (closeLessonButton) {
    closeLessonButton.addEventListener("click", closeLesson);
}

if (lessonModal) {
    lessonModal.addEventListener("click", event => {
        if (event.target === lessonModal) closeLesson();
    });
}

const completeLessonButton = document.getElementById("completeLessonButton");

if (completeLessonButton) {
    completeLessonButton.addEventListener("click", () => {
        if (!currentLessonId) return;

        const firstTime = completeOnce("lessons", currentLessonId, 10);

        completeLessonButton.textContent = "Lección completada ✓";

        showToast(
            firstTime ? "¡Muy bien!" : "Lección ya completada",
            firstTime ? "Ganaste 10 puntos." : "Ya habías ganado los puntos de esta lección.",
            "🎓"
        );
    });
}


/* =====================================================
   5. PLANES DE ESTUDIO
   ===================================================== */

const planTabs = document.querySelectorAll(".plan-tab");
const planPanels = document.querySelectorAll(".study-plan");

function activatePlan(planName) {
    planTabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.plan === planName);
    });

    planPanels.forEach(panel => {
        panel.classList.toggle("active", panel.id === `plan-${planName}`);
    });
}

planTabs.forEach(tab => {
    tab.addEventListener("click", () => activatePlan(tab.dataset.plan));
});


/* =====================================================
   6. FILTROS DE LECCIONES
   ===================================================== */

const filterButtons = document.querySelectorAll(".filter-button");
const lessonCards = document.querySelectorAll(".lesson-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        lessonCards.forEach(card => {
            const category = card.dataset.category;
            card.hidden = filter !== "todos" && category !== filter;
        });
    });
});


/* =====================================================
   7. LABORATORIOS INTERACTIVOS
   ===================================================== */

const labTabs = document.querySelectorAll(".lab-tab");

function activateLab(labName) {
    labTabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.lab === labName);
    });

    document.querySelectorAll(".lab-panel").forEach(panel => {
        panel.classList.toggle("active", panel.id === `lab-${labName}`);
    });
}

labTabs.forEach(tab => {
    tab.addEventListener("click", () => activateLab(tab.dataset.lab));
});

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function markExperiment(id) {
    completeOnce("experiments", id, 5);
}


/* Laboratorio de velocidad */

const distanceSlider = document.getElementById("distanceSlider");
const timeSlider = document.getElementById("timeSlider");

function updateVelocityLab(changed) {
    if (!distanceSlider || !timeSlider) return;

    const distance = Number(distanceSlider.value);
    const time = Number(timeSlider.value);
    const velocity = distance / time;

    setText("distanceValue", `${distance} m`);
    setText("timeValue", `${time} s`);
    setText("velocityResult", `${velocity.toFixed(2)} m/s`);

    const car = document.getElementById("labCar");

    if (car) {
        const percentage = ((distance - Number(distanceSlider.min)) /
            (Number(distanceSlider.max) - Number(distanceSlider.min))) * 80;

        car.style.transform = `translateX(${percentage}%)`;
    }

    if (changed === "distance") markExperiment("velocidad-distancia");
    if (changed === "time") markExperiment("velocidad-tiempo");
}

if (distanceSlider) {
    distanceSlider.addEventListener("input", () => updateVelocityLab("distance"));
}

if (timeSlider) {
    timeSlider.addEventListener("input", () => updateVelocityLab("time"));
}


/* Laboratorio de funciones */

const xSlider = document.getElementById("xSlider");

function updateFunctionLab() {
    if (!xSlider) return;

    const x = Number(xSlider.value);
    const y = 2 * x + 3;

    setText("xValue", x);
    setText("yResult", y);
    setText("graphX", x);
    setText("graphY", y);

    const point = document.getElementById("functionPoint");

    if (point) {
        // Ajuste del punto dentro de una cuadrícula aproximada.
        const left = ((x + 10) / 20) * 90;
        const top = 100 - ((y + 17) / 40) * 90;

        point.style.left = `${Math.max(0, Math.min(90, left))}%`;
        point.style.top = `${Math.max(0, Math.min(90, top))}%`;
    }

    markExperiment("funcion-lineal");
}

if (xSlider) {
    xSlider.addEventListener("input", updateFunctionLab);
}


/* Laboratorio de fuerza */

const massSlider = document.getElementById("massSlider");
const accelerationSlider = document.getElementById("accelerationSlider");

function updateForceLab(changed) {
    if (!massSlider || !accelerationSlider) return;

    const mass = Number(massSlider.value);
    const acceleration = Number(accelerationSlider.value);
    const force = mass * acceleration;

    setText("massValue", `${mass} kg`);
    setText("accelerationValue", `${acceleration} m/s²`);
    setText("forceResult", `${force} N`);

    if (changed === "mass") markExperiment("fuerza-masa");
    if (changed === "acceleration") markExperiment("fuerza-aceleracion");
}

if (massSlider) {
    massSlider.addEventListener("input", () => updateForceLab("mass"));
}

if (accelerationSlider) {
    accelerationSlider.addEventListener("input", () => updateForceLab("acceleration"));
}


/* =====================================================
   8. PREGUNTAS PARA JUEGOS Y RETOS
   ===================================================== */

const questionBanks = {
    velocidad: [
        {
            question: "Un objeto recorre 100 m en 10 s. ¿Cuál es su rapidez media?",
            answers: ["5 m/s", "10 m/s", "1000 m/s", "20 m/s"],
            correct: 1,
            explanation: "La rapidez es distancia dividida entre tiempo: 100 ÷ 10 = 10 m/s."
        },
        {
            question: "¿En qué unidad se mide normalmente la rapidez en el Sistema Internacional?",
            answers: ["Kilogramos", "Newtons", "Metros por segundo", "Julios"],
            correct: 2,
            explanation: "La rapidez se puede expresar en metros por segundo (m/s)."
        },
        {
            question: "Si recorres 30 m en 5 s, ¿cuál es tu rapidez media?",
            answers: ["6 m/s", "15 m/s", "25 m/s", "35 m/s"],
            correct: 0,
            explanation: "30 dividido entre 5 es igual a 6 m/s."
        }
    ],

    matematicas: [
        {
            question: "¿Cuánto es 12 × 4?",
            answers: ["36", "48", "42", "16"],
            correct: 1,
            explanation: "12 multiplicado por 4 es 48."
        },
        {
            question: "Si x + 7 = 15, ¿cuánto vale x?",
            answers: ["7", "15", "8", "22"],
            correct: 2,
            explanation: "Restamos 7 a ambos lados: x = 15 - 7 = 8."
        },
        {
            question: "Si y = 2x + 3 y x = 4, ¿cuánto vale y?",
            answers: ["8", "11", "10", "14"],
            correct: 1,
            explanation: "y = 2(4) + 3 = 11."
        }
    ],

    espacio: [
        {
            question: "¿Qué fuerza mantiene a los planetas en órbita alrededor del Sol?",
            answers: ["La fricción", "La gravedad", "El sonido", "La electricidad estática"],
            correct: 1,
            explanation: "La gravedad es fundamental para las órbitas de los planetas."
        },
        {
            question: "¿Cuál es la estrella más cercana a la Tierra?",
            answers: ["Sirio", "La estrella polar", "El Sol", "Próxima Centauri"],
            correct: 2,
            explanation: "El Sol es la estrella más cercana a la Tierra."
        },
        {
            question: "¿Cómo se llama nuestra galaxia?",
            answers: ["Andrómeda", "Vía Láctea", "Sistema Solar", "Orión"],
            correct: 1,
            explanation: "Nuestro sistema solar está dentro de la Vía Láctea."
        }
    ],

    geometria: [
        {
            question: "¿Cuál es el área de un rectángulo de 5 cm por 3 cm?",
            answers: ["8 cm²", "15 cm²", "16 cm²", "30 cm²"],
            correct: 1,
            explanation: "Área = base × altura = 5 × 3 = 15 cm²."
        },
        {
            question: "¿Cuántos grados suman los ángulos interiores de un triángulo plano?",
            answers: ["90°", "180°", "270°", "360°"],
            correct: 1,
            explanation: "Los ángulos interiores de un triángulo suman 180°."
        },
        {
            question: "¿Cuántos lados tiene un hexágono?",
            answers: ["5", "6", "7", "8"],
            correct: 1,
            explanation: "Un hexágono tiene seis lados."
        }
    ],

    movimiento: [
        {
            question: "¿Qué fórmula permite calcular la rapidez media?",
            answers: ["v = d ÷ t", "F = m × a", "m = F × a", "v = t ÷ d"],
            correct: 0,
            explanation: "La rapidez media es la distancia recorrida dividida entre el tiempo."
        },
        {
            question: "¿Qué ocurre con un objeto si cambia su posición respecto a un punto de referencia?",
            answers: ["Está en reposo necesariamente", "Está en movimiento", "Pierde su masa", "Deja de tener energía"],
            correct: 1,
            explanation: "El cambio de posición respecto a una referencia indica movimiento."
        }
    ],

    ecuaciones: [
        {
            question: "Resuelve: x + 5 = 12.",
            answers: ["5", "7", "12", "17"],
            correct: 1,
            explanation: "x = 12 - 5 = 7."
        },
        {
            question: "Si 4x = 20, ¿cuánto vale x?",
            answers: ["4", "5", "16", "80"],
            correct: 1,
            explanation: "Dividimos ambos lados entre 4: x = 20 ÷ 4 = 5."
        }
    ],

    fuerza: [
        {
            question: "¿Cuál es la fórmula de la segunda ley de Newton?",
            answers: ["F = m × a", "v = d ÷ t", "W = m ÷ a", "F = d × t"],
            correct: 0,
            explanation: "La fuerza neta es igual a la masa multiplicada por la aceleración."
        },
        {
            question: "Una masa de 2 kg acelera a 3 m/s². ¿Cuál es la fuerza neta?",
            answers: ["5 N", "6 N", "1,5 N", "9 N"],
            correct: 1,
            explanation: "F = 2 × 3 = 6 N."
        }
    ],

    funciones: [
        {
            question: "Si y = 2x + 1 y x = 3, ¿cuánto vale y?",
            answers: ["5", "6", "7", "9"],
            correct: 2,
            explanation: "y = 2(3) + 1 = 7."
        },
        {
            question: "En una función, ¿qué representa normalmente la variable x?",
            answers: ["El valor de entrada", "Siempre el resultado", "Una unidad de fuerza", "El área"],
            correct: 0,
            explanation: "En este ejemplo, x es la entrada que se usa para calcular y."
        }
    ],

    mixto: [
        {
            question: "Un objeto recorre 40 m en 8 s. ¿Cuál es su rapidez media?",
            answers: ["4 m/s", "5 m/s", "8 m/s", "32 m/s"],
            correct: 1,
            explanation: "40 ÷ 8 = 5 m/s."
        },
        {
            question: "Si x - 4 = 9, ¿cuánto vale x?",
            answers: ["5", "9", "13", "36"],
            correct: 2,
            explanation: "Sumamos 4 a ambos lados: x = 9 + 4 = 13."
        },
        {
            question: "¿En qué unidad se mide la fuerza?",
            answers: ["Metro", "Kilogramo", "Newton", "Segundo"],
            correct: 2,
            explanation: "La fuerza se mide en newtons (N)."
        },
        {
            question: "¿Cuál es la fórmula del área de un rectángulo?",
            answers: ["Base + altura", "Base × altura", "Base ÷ altura", "2 × base"],
            correct: 1,
            explanation: "El área del rectángulo se calcula multiplicando la base por la altura."
        }
    ]
};


/* =====================================================
   9. MOTOR DE JUEGOS
   ===================================================== */

const gameModal = document.getElementById("gameModal");
const gameTitles = {
    velocidad: "Desafío de velocidad",
    matematicas: "Mente matemática",
    espacio: "Exploradores del espacio",
    geometria: "Reto geométrico",
    movimiento: "Reto de movimiento",
    ecuaciones: "Reto de ecuaciones",
    fuerza: "Reto de fuerzas",
    funciones: "Reto de funciones",
    mixto: "Reto mixto"
};

let activeQuiz = null;

function shuffleQuestions(questions) {
    const copy = [...questions];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

function openQuiz(type, mode = "game") {
    const bank = questionBanks[type];

    if (!bank || !gameModal) {
        showToast("Juego no disponible", "No se encontró este juego.", "⚠️");
        return;
    }

    activeQuiz = {
        type,
        mode,
        questions: shuffleQuestions(bank),
        index: 0,
        score: 0,
        answered: false
    };

    const category = document.getElementById("gameModalCategory");
    const title = document.getElementById("gameModalTitle");

    if (category) {
        category.textContent = mode === "challenge" ? "RETO" : "JUEGO EDUCATIVO";
    }

    if (title) {
        title.textContent = gameTitles[type] || "EduLab";
    }

    gameModal.classList.add("active");
    renderQuestion();
}

function renderQuestion() {
    if (!activeQuiz) return;

    const question = activeQuiz.questions[activeQuiz.index];

    const number = document.getElementById("questionNumber");
    const questionText = document.getElementById("gameQuestion");
    const scoreText = document.getElementById("gameScore");
    const answerGrid = document.getElementById("answerGrid");
    const feedback = document.getElementById("gameFeedback");

    if (!question || !answerGrid) return;

    if (number) {
        number.textContent =
            `Pregunta ${activeQuiz.index + 1} de ${activeQuiz.questions.length}`;
    }

    if (questionText) questionText.textContent = question.question;
    if (scoreText) scoreText.textContent = `Puntos: ${activeQuiz.score}`;
    if (feedback) feedback.textContent = "";

    answerGrid.innerHTML = "";

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-option";
        button.textContent = answer;

        button.addEventListener("click", () => selectAnswer(index));

        answerGrid.appendChild(button);
    });
}

function selectAnswer(answerIndex) {
    if (!activeQuiz || activeQuiz.answered) return;

    activeQuiz.answered = true;

    const question = activeQuiz.questions[activeQuiz.index];
    const buttons = document.querySelectorAll("#answerGrid button");
    const feedback = document.getElementById("gameFeedback");

    buttons.forEach(button => button.disabled = true);

    if (answerIndex === question.correct) {
        activeQuiz.score++;
        if (buttons[answerIndex]) buttons[answerIndex].classList.add("correct");

        if (feedback) {
            feedback.textContent = `¡Correcto! ${question.explanation}`;
        }
    } else {
        if (buttons[answerIndex]) buttons[answerIndex].classList.add("incorrect");
        if (buttons[question.correct]) {
            buttons[question.correct].classList.add("correct");
        }

        if (feedback) {
            feedback.textContent = `No es esa. ${question.explanation}`;
        }
    }

    const scoreText = document.getElementById("gameScore");
    if (scoreText) scoreText.textContent = `Puntos: ${activeQuiz.score}`;

    let nextButton = document.getElementById("nextQuestionButton");

    if (!nextButton) {
        nextButton = document.createElement("button");
        nextButton.id = "nextQuestionButton";
        nextButton.type = "button";
        nextButton.className = "primary-button";
        nextButton.style.marginTop = "16px";

        const container = document.getElementById("gameContainer") ||
            document.getElementById("answerGrid").parentElement;

        container.appendChild(nextButton);
    }

    nextButton.textContent =
        activeQuiz.index === activeQuiz.questions.length - 1
            ? "Terminar juego"
            : "Siguiente pregunta";

    nextButton.onclick = advanceQuiz;
}

function advanceQuiz() {
    if (!activeQuiz) return;

    const nextButton = document.getElementById("nextQuestionButton");
    if (nextButton) nextButton.remove();

    if (activeQuiz.index < activeQuiz.questions.length - 1) {
        activeQuiz.index++;
        activeQuiz.answered = false;
        renderQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    if (!activeQuiz) return;

    const quiz = activeQuiz;
    const total = quiz.questions.length;
    const percentage = Math.round((quiz.score / total) * 100);

    const questionText = document.getElementById("gameQuestion");
    const answerGrid = document.getElementById("answerGrid");
    const feedback = document.getElementById("gameFeedback");
    const number = document.getElementById("questionNumber");
    const scoreText = document.getElementById("gameScore");

    if (number) number.textContent = "Juego terminado";
    if (questionText) {
        questionText.textContent =
            `Obtuviste ${quiz.score} de ${total} respuestas correctas (${percentage}%).`;
    }

    if (answerGrid) answerGrid.innerHTML = "";
    if (scoreText) scoreText.textContent = `Resultado: ${quiz.score}/${total}`;

    if (feedback) {
        feedback.textContent = percentage >= 70
            ? "¡Excelente trabajo! Sigue aprendiendo."
            : "¡Buen intento! Repasa los temas y vuelve a intentarlo.";
    }

    const pointsWon = quiz.score * 5;
    let message = `Ganaste ${pointsWon} puntos por tus respuestas correctas.`;

    if (quiz.mode === "game") {
        const firstTime = completeOnce("games", quiz.type, pointsWon);

        if (!firstTime) {
            // No se vuelven a entregar puntos de finalización.
            message = "Juego terminado. Tu progreso ya estaba registrado.";
        }
    } else {
        const firstTime = completeOnce("challenges", quiz.type, pointsWon);

        if (!firstTime) {
            message = "Reto terminado. Ya estaba registrado en tu progreso.";
        }
    }

    showToast("¡Actividad terminada!", message, "🏆");

    const nextButton = document.getElementById("nextQuestionButton");

    if (nextButton) {
        nextButton.textContent = "Cerrar";
        nextButton.onclick = closeQuiz;
    } else if (answerGrid) {
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "primary-button";
        closeButton.textContent = "Cerrar";
        closeButton.onclick = closeQuiz;
        answerGrid.appendChild(closeButton);
    }

    activeQuiz = null;
}

function closeQuiz() {
    if (gameModal) gameModal.classList.remove("active");

    const nextButton = document.getElementById("nextQuestionButton");
    if (nextButton) nextButton.remove();

    activeQuiz = null;
}

document.querySelectorAll("[data-game]").forEach(button => {
    button.addEventListener("click", () => {
        openQuiz(button.dataset.game, "game");
    });
});

document.querySelectorAll("[data-challenge]").forEach(button => {
    button.addEventListener("click", () => {
        openQuiz(button.dataset.challenge, "challenge");
    });
});

const closeGameButton = document.getElementById("closeGameModal");

if (closeGameButton) {
    closeGameButton.addEventListener("click", closeQuiz);
}

if (gameModal) {
    gameModal.addEventListener("click", event => {
        if (event.target === gameModal) closeQuiz();
    });
}


/* =====================================================
   10. NOTIFICACIONES
   ===================================================== */

function showToast(title, message, icon = "✨") {
    const toast = document.getElementById("toast");

    if (!toast) return;

    setText("toastIcon", icon);
    setText("toastTitle", title);
    setText("toastMessage", message);

    toast.classList.add("show", "active");

    window.clearTimeout(showToast.timeout);

    showToast.timeout = window.setTimeout(() => {
        toast.classList.remove("show", "active");
    }, 3500);
}


/* =====================================================
   11. ACTUALIZAR TODOS LOS INDICADORES
   ===================================================== */

function setProgressBar(id, percentage) {
    const element = document.getElementById(id);

    if (element) {
        element.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
    }
}

function updateProgressUI() {
    const lessonCount = progress.lessons.length;
    const experimentCount = progress.experiments.length;
    const gameCount = progress.games.length;
    const challengeCount = progress.challenges.length;

    const lessonPercent = Math.min(100, (lessonCount / 12) * 100);
    const experimentPercent = Math.min(100, (experimentCount / 6) * 100);
    const gamePercent = Math.min(100, (gameCount / 4) * 100);
    const challengePercent = Math.min(100, (challengeCount / 5) * 100);

    const totalPercent = Math.round(
        (lessonPercent + experimentPercent + gamePercent + challengePercent) / 4
    );

    setText("points", progress.points);
    setText("totalPoints", progress.points);

    setText("lessonsCompleted", `${lessonCount} / 12`);
    setText("experimentsCompleted", `${experimentCount} / 6`);
    setText("gamesCompleted", `${gameCount} / 4`);
    setText("challengesCompleted", `${challengeCount} / 5`);

    setText("homeProgress", `${totalPercent}%`);
    setText("homeProgressText", `${totalPercent}% completado`);
    setText("dailyPercentage", `${totalPercent}%`);

    setText("totalProgress", `${totalPercent}%`);
    setText("progressLessons", `${lessonCount} / 12`);
    setText("progressExperiments", `${experimentCount} / 6`);
    setText("progressGames", `${gameCount} / 4`);
    setText("progressChallenges", `${challengeCount} / 5`);

    setProgressBar("lessonsProgressBar", lessonPercent);
    setProgressBar("experimentsProgressBar", experimentPercent);
    setProgressBar("gamesProgressBar", gamePercent);
    setProgressBar("challengesProgressBar", challengePercent);

    setText("mathPlanPercentage", `${calculatePlanProgress("matematicas")}%`);
    setText("physicsPlanPercentage", `${calculatePlanProgress("fisica")}%`);

    updateAchievements();
}

function calculatePlanProgress(subject) {
    const mathLessons = [
        "operaciones", "algebra", "ecuaciones",
        "funciones", "geometria", "estadistica"
    ];

    const physicsLessons = [
        "movimiento", "fuerza", "gravedad",
        "energia", "trabajo", "ondas"
    ];

    const list = subject === "matematicas" ? mathLessons : physicsLessons;
    const completed = list.filter(id => progress.lessons.includes(id)).length;

    return Math.round((completed / list.length) * 100);
}

function updateAchievements() {
    const achievements = document.querySelectorAll(".achievement");

    achievements.forEach((achievement, index) => {
        let unlocked = false;

        if (index === 0) unlocked = progress.lessons.length >= 1;
        if (index === 1) unlocked = progress.lessons.length >= 5;
        if (index === 2) unlocked = progress.experiments.length >= 1;
        if (index === 3) unlocked = progress.games.length >= 1;
        if (index === 4) unlocked = progress.challenges.length >= 1;
        if (index >= 5) unlocked = progress.points >= (index + 1) * 50;

        achievement.classList.toggle("locked", !unlocked);
        achievement.classList.toggle("unlocked", unlocked);
    });
}


/* =====================================================
   12. CERRAR VENTANAS CON LA TECLA ESC
   ===================================================== */

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeLesson();
        closeQuiz();
    }
});


/* =====================================================
   13. INICIAR EDULAB
   ===================================================== */

// Mostrar los valores iniciales de los laboratorios.
updateVelocityLab();
updateFunctionLab();
updateForceLab();

// Actualizar puntos, barras y estadísticas guardadas.
updateProgressUI();

// Abrir la página de inicio.
showSection("inicio");
