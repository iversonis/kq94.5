
const botonMenu = document.getElementById("menu-toggle");
const navegacion = document.getElementById("navegacion");
const enlaces = navegacion.querySelectorAll(":scope > a");
const pestanasProgramacion = document.querySelectorAll(".programacion-dia");
const panelProgramacion = document.getElementById("programacion-horario");
const tarjetasProgramacion = document.getElementById("programacion-tarjetas");
const horarioEntreSemana = Array.from(
    tarjetasProgramacion.querySelectorAll(".programacion-fila"),
    (fila) => ({
        hora: fila.querySelector(".programacion-hora").textContent.trim(),
        nombre: fila.querySelector(".programacion-detalle h3").textContent.trim(),
        locutor: fila.querySelector(".programacion-detalle p")?.textContent.trim() ?? ""
    })
);
const programasFinDeSemana = {
    "dia-sabado": [
        { hora: "9:00 AM – 12:00 PM", nombre: "Salón de la Fama", locutor: "" },
        { hora: "12:00 PM – 5:00 PM", nombre: "Programación regular", locutor: "" },
        { hora: "5:00 PM – 9:00 PM", nombre: "Junior en Salsa", locutor: "" },
        { hora: "9:00 PM – 6:00 AM", nombre: "Programación regular", locutor: "Hasta el domingo" }
    ],
    "dia-domingo": [
        { hora: "12:00 AM – 8:00 AM", nombre: "Programación regular", locutor: "" },
        { hora: "8:00 AM – 12:00 PM", nombre: "El Merengazo del Domingo", locutor: "" },
        { hora: "12:00 PM – 3:00 PM", nombre: "Programación regular", locutor: "" },
        { hora: "3:00 PM – 8:30 PM", nombre: "30 Kilo de Salsa", locutor: "" },
        { hora: "8:30 PM – 6:00 AM", nombre: "Programación regular", locutor: "Hasta el lunes" }
    ]
};

function mostrarProgramacion(programas) {
    tarjetasProgramacion.replaceChildren();

    programas.forEach(({ hora, nombre, locutor }) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "programacion-tarjeta";

        const icono = document.createElement("div");
        icono.className = "programacion-tarjeta__icono";
        icono.setAttribute("aria-hidden", "true");
        icono.textContent = /deport|sport/i.test(nombre) ? "⚽"
            : /buenos|despacio|sal[oó]n/i.test(nombre) ? "🌅"
                : /notic|politikal/i.test(nombre) ? "📰"
                    : /m[uú]sica|salsa|mereng|mezcla|regular/i.test(nombre) ? "🎵"
                        : "🎙️";

        const contenido = document.createElement("div");
        contenido.className = "programacion-tarjeta__contenido";

        const titulo = document.createElement("h3");
        titulo.textContent = nombre;
        contenido.append(titulo);

        const periodo = document.createElement("p");
        periodo.textContent = `${hora}${locutor ? ` · ${locutor}` : ""}`;
        contenido.append(periodo);

        tarjeta.append(icono, contenido);
        tarjetasProgramacion.append(tarjeta);
    });

    tarjetasProgramacion.scrollTo({ left: 0 });
}

mostrarProgramacion(horarioEntreSemana);

pestanasProgramacion.forEach((pestana, indice) => {
    pestana.addEventListener("click", () => {
        pestanasProgramacion.forEach((item) => {
            const seleccionada = item === pestana;
            item.classList.toggle("activo", seleccionada);
            item.setAttribute("aria-selected", seleccionada);
            item.tabIndex = seleccionada ? 0 : -1;
        });

        panelProgramacion.setAttribute("aria-labelledby", pestana.id);
        const programasFinDeSemanaDelDia = programasFinDeSemana[pestana.id];

        if (programasFinDeSemanaDelDia) {
            mostrarProgramacion(programasFinDeSemanaDelDia);
        } else {
            mostrarProgramacion(horarioEntreSemana);
        }
    });

    pestana.addEventListener("keydown", (evento) => {
        if (evento.key !== "ArrowRight" && evento.key !== "ArrowLeft") {
            return;
        }

        evento.preventDefault();
        const direccion = evento.key === "ArrowRight" ? 1 : -1;
        const siguiente = (indice + direccion + pestanasProgramacion.length) % pestanasProgramacion.length;
        pestanasProgramacion[siguiente].focus();
        pestanasProgramacion[siguiente].click();
    });
});

document.querySelectorAll(".programacion-flecha").forEach((flecha) => {
    flecha.addEventListener("click", () => {
        const direccion = Number(flecha.dataset.direccion);
        tarjetasProgramacion.scrollBy({
            left: direccion * tarjetasProgramacion.clientWidth * 0.8,
            behavior: "smooth"
        });
    });
});

botonMenu.addEventListener("click", () => {
    const abierto = navegacion.classList.toggle("abierto");

    botonMenu.setAttribute("aria-expanded", abierto);
    botonMenu.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
    );
    botonMenu.textContent = abierto ? "✕" : "☰";
});

enlaces.forEach((enlace) => {
    enlace.addEventListener("click", () => {
        enlaces.forEach((item) => item.classList.remove("activo"));
        enlace.classList.add("activo");

        navegacion.classList.remove("abierto");
        botonMenu.setAttribute("aria-expanded", "false");
        botonMenu.setAttribute("aria-label", "Abrir menú");
        botonMenu.textContent = "☰";
    });
});

const radio = document.getElementById("radio-stream");
const botonRadio = document.getElementById("radio-toggle");
const iconoRadio = document.getElementById("radio-toggle-icon");
const estadoRadio = document.getElementById("radio-status");
const controlVolumen = document.getElementById("radio-volume");

botonRadio.addEventListener("click", () => {
    if (radio.paused) {
        estadoRadio.textContent = "Conectando...";
        radio.play().catch(() => {
            estadoRadio.textContent = "No se pudo iniciar la transmisión. Intenta de nuevo.";
        });
        return;
    }

    radio.pause();
});

radio.addEventListener("playing", () => {
    iconoRadio.textContent = "Ⅱ";
    botonRadio.setAttribute("aria-label", "Pausar Radio Novedades");
    botonRadio.setAttribute("aria-pressed", "true");
    estadoRadio.textContent = "Reproduciendo ahora";
});

radio.addEventListener("pause", () => {
    iconoRadio.textContent = "▶";
    botonRadio.setAttribute("aria-label", "Reproducir Radio Novedades");
    botonRadio.setAttribute("aria-pressed", "false");
    estadoRadio.textContent = "Transmisión pausada";
});

radio.addEventListener("error", () => {
    estadoRadio.textContent = "No se pudo conectar. Verifica tu conexión e intenta de nuevo.";
});

controlVolumen.addEventListener("input", () => {
    radio.volume = Number(controlVolumen.value);
    estadoRadio.textContent = "Conectando...";
    radio.play().catch((error) => {
        if (error.name === "NotAllowedError") {
            estadoRadio.textContent = "Pulsa reproducir para iniciar; el navegador bloqueó la reproducción automática.";
            return;
        }

        estadoRadio.textContent = "No se pudo iniciar la transmisión. Intenta de nuevo.";
    });
});

radio.volume = Number(controlVolumen.value);