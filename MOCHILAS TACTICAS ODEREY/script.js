(function (window, document, tag, layer, containerId) {
    window[layer] = window[layer] || [];
    window[layer].push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js"
    });

    const firstScript = document.getElementsByTagName(tag)[0];
    const gtmScript = document.createElement(tag);
    const layerParameter = layer !== "dataLayer" ? "&l=" + layer : "";

    gtmScript.async = true;
    gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=" + containerId + layerParameter;
    firstScript.parentNode.insertBefore(gtmScript, firstScript);
})(window, document, "script", "dataLayer", "GTM-PNWFR3ZK");

/* =====================================================
   ODEREY - CARRITO
===================================================== */

let carrito = JSON.parse(
    localStorage.getItem("carritoODEREY")
) || [];

function escaparHTML(valor) {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function imagenLocalSegura(valor) {
    let ruta;

    try {
        ruta = decodeURIComponent(String(valor || "").trim());
    } catch {
        return "";
    }

    const coincidencia = /^imagenes\/([^/\\]+)$/iu.exec(ruta);
    if (!coincidencia || !/^[\p{L}\p{N}_. ()+-]+\.(?:avif|jpe?g|png|webp)$/iu.test(coincidencia[1])) {
        return "";
    }

    return `imagenes/${encodeURIComponent(coincidencia[1])}`;
}
function arreglarImagenesRotas() {
    const imagenFallback = "imagenes/BORDADO.jpeg";

    document.querySelectorAll("img").forEach(img => {
        const src = (img.getAttribute("src") || "").trim();

        if (!src) {
            img.setAttribute("src", imagenFallback);
            return;
        }

        img.onerror = () => {
            if (img.dataset.fallbackAplicado !== "true") {
                img.dataset.fallbackAplicado = "true";
                img.src = imagenFallback;
            }
        };
    });
}

arreglarImagenesRotas();

function configurarZoomImagenes() {
    const modal = document.createElement("div");
    modal.className = "visor-imagen";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
        <button class="visor-cerrar" type="button" aria-label="Cerrar imagen">&times;</button>
        <img class="visor-imagen-grande" alt="">
    `;
    document.body.appendChild(modal);

    const imagenGrande = modal.querySelector(".visor-imagen-grande");
    const cerrar = () => {
        modal.classList.remove("activo");
        modal.setAttribute("aria-hidden", "true");
        imagenGrande.removeAttribute("src");
    };

    modal.querySelector(".visor-cerrar").addEventListener("click", cerrar);
    modal.addEventListener("click", evento => {
        if (evento.target === modal) cerrar();
    });
    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") cerrar();
    });
}

configurarZoomImagenes();
/* GUARDAR */

function guardarCarrito() {

    localStorage.setItem(
        "carritoODEREY",
        JSON.stringify(carrito)
    );

}


/* CONTADOR */

function actualizarContador() {

    document.querySelectorAll(".carrito").forEach(
        boton => {

            boton.textContent =
                `🛒 CARRITO (${carrito.length})`;

        }
    );

}


/* AGREGAR */

function configurarProductos() {

    document.querySelectorAll(
        ".boton-producto"
    ).forEach(boton => {

        boton.addEventListener(
            "click",
            function () {

                const tarjeta =
                    boton.closest(".producto");

                if (!tarjeta) return;


                const nombre =
                    tarjeta.querySelector("h3")
                    ?.textContent.trim()
                    || "Producto ODEREY";


                const precioTexto =
                    tarjeta.querySelector(".precio")
                    ?.textContent
                    || tarjeta.querySelector("p")
                    ?.textContent
                    || "$0";


                const precio =
                    parseFloat(
                        precioTexto
                            .replace("$", "")
                            .replace(",", ".")
                    ) || 0;


                const imagen =
                    tarjeta.querySelector("img")
                    ?.getAttribute("src")
                    || "";


                carrito.push({

                    id: Date.now() +
                        Math.random(),

                    nombre: nombre,

                    precio: precio,

                    imagen: imagen

                });


                guardarCarrito();

                actualizarContador();


                const texto =
                    boton.textContent;

                boton.textContent =
                    "✓ AGREGADO";


                boton.classList.add("agregado");


                setTimeout(() => {

                    boton.textContent = texto;

                    boton.classList.remove(
                        "agregado"
                    );

                }, 1200);

            }
        );

    });

}


/* BOTÓN CARRITO */

function configurarBotonCarrito() {

    document.querySelectorAll(
        ".carrito"
    ).forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "carrito.html";

            }
        );

    });

}


/* MOSTRAR CARRITO */

function mostrarCarrito() {

    const lista =
        document.getElementById(
            "lista-carrito"
        );

    const total =
        document.getElementById("total");

    const totalResumen =
        document.getElementById("total-resumen");

    const subtotalResumen =
        document.getElementById("subtotal");

    const envioResumen =
        document.getElementById("envio");

    const cantidadItems =
        document.getElementById("cantidad-items");


    if (!lista) return;

    const subtotal = carrito.reduce((suma, producto) => suma + (Number(producto.precio) || 0), 0);
    const envio = carrito.length > 0 && subtotal < 200 ? 5 : 0;
    const totalPedido = subtotal + envio;

    if (cantidadItems) {
        cantidadItems.textContent = String(carrito.length);
    }

    if (subtotalResumen) {
        subtotalResumen.textContent = `$${subtotal.toFixed(2)}`;
    }

    if (envioResumen) {
        envioResumen.textContent = `$${envio.toFixed(2)}`;
    }

    if (totalResumen) {
        totalResumen.textContent = `$${totalPedido.toFixed(2)}`;
    }

    if (total) {
        total.textContent = `$${totalPedido.toFixed(2)}`;
    }

    if (carrito.length === 0) {

        lista.innerHTML = `

            <div class="carrito-vacio">

                🛒

                <br><br>

                Tu carrito está vacío.

                <br><br>

                <a
                    href="mochilas.html"
                    class="boton"
                >
                    VER MOCHILAS
                </a>

            </div>

        `;

        if (cantidadItems) {
            cantidadItems.textContent = "0";
        }

        if (subtotalResumen) {
            subtotalResumen.textContent = "$0.00";
        }

        if (envioResumen) {
            envioResumen.textContent = "$0.00";
        }

        if (totalResumen) {
            totalResumen.textContent = "$0.00";
        }

        if (total) {
            total.textContent = "$0.00";
        }

        return;

    }


    lista.innerHTML = "";

    carrito.forEach(
        (producto, indice) => {

            lista.innerHTML += `

                <div class="item-carrito">

                    <img
                        src="${imagenLocalSegura(producto.imagen)}"
                        alt="${escaparHTML(producto.nombre)}"
                    >

                    <div class="info-carrito">

                        <h3>
                            ${escaparHTML(producto.nombre)}
                        </h3>

                        <p>
                            $${Number(
                                producto.precio
                            ).toFixed(2)}
                        </p>

                    </div>

                    <button
                        class="eliminar"
                        onclick="eliminarProducto(${indice})"
                    >
                        ✕
                    </button>

                </div>

            `;

        }
    );

}


/* ELIMINAR */

function eliminarProducto(indice) {

    carrito.splice(indice, 1);

    guardarCarrito();

    actualizarContador();

    mostrarCarrito();

}


/* VACIAR */

function vaciarCarrito() {

    carrito = [];

    guardarCarrito();

    actualizarContador();

    mostrarCarrito();

}


/* WHATSAPP */

function enviarPedido() {

    if (carrito.length === 0) {

        alert(
            "Tu carrito está vacío."
        );

        return;

    }

    const subtotal = carrito.reduce((suma, producto) => suma + (Number(producto.precio) || 0), 0);
    const envio = subtotal < 200 ? 5 : 0;
    const total = subtotal + envio;

    let mensaje =
        "Hola ODEREY 👋\n\n" +
        "Quiero realizar este pedido:\n\n";


    carrito.forEach(producto => {

        mensaje +=
            "• " +
            producto.nombre +
            " - $" +
            Number(
                producto.precio
            ).toFixed(2) +
            "\n";

    });

    mensaje +=
        "\n💰 SUBTOTAL: $" +
        subtotal.toFixed(2) +
        "\n" +
        "🚚 ENVÍO: $" +
        envio.toFixed(2) +
        "\n" +
        "TOTAL: $" +
        total.toFixed(2);


    const url =
        "https://wa.me/593939567855?text=" +
        encodeURIComponent(mensaje);


    window.open(
        url,
        "_blank"
    );

}


/* SELECTOR DE COLOR Y CANTIDAD */

function configurarSelectorProducto() {

    document.querySelectorAll(".color").forEach(boton => {

        boton.addEventListener("click", () => {

            const colorSeleccionado = boton.dataset.color || boton.textContent.trim();

            document.querySelectorAll(".color").forEach(item => {
                item.classList.toggle("activo", item === boton);
            });

            const textoColor = document.querySelector(".selector-color p strong");

            if (textoColor) {
                textoColor.textContent = colorSeleccionado;
            }

        });

    });

    document.querySelectorAll(".cantidad-btn").forEach(boton => {

        boton.addEventListener("click", () => {

            const contenedor = boton.closest(".control");
            const input = contenedor?.querySelector("input");

            if (!input) return;

            let valorActual = Number(input.value) || 1;

            if (boton.classList.contains("mas")) {
                valorActual += 1;
            } else {
                valorActual = Math.max(1, valorActual - 1);
            }

            input.value = valorActual;

        });

    });

}

function mostrarDetalleProducto(mostrar = true) {
    document.querySelectorAll(".producto-destacado").forEach(seccion => {
        seccion.classList.toggle("visible", mostrar);
    });
}

function actualizarProductoDestacado({ nombre, precio, imagen }) {

    const titulo = document.querySelector(".producto-info-detallada h1");
    const precioActual = document.querySelector(".precio-actual");
    const precioAnterior = document.querySelector(".precio-anterior");
    const imagenPrincipal = document.querySelector(".imagen-principal img");
    const contenedorImagen = document.querySelector(".imagen-principal");

    if (titulo) titulo.textContent = nombre;
    if (precioActual) precioActual.textContent = `$${Number(precio).toFixed(2)}`;
    if (precioAnterior) precioAnterior.textContent = `$${(Number(precio) * 1.55).toFixed(2)}`;
    if (imagenPrincipal && imagen) imagenPrincipal.src = imagen;
    if (imagenPrincipal && imagen) imagenPrincipal.alt = nombre;

    if (imagenPrincipal && imagen) {
        imagenPrincipal.src = imagen;
        imagenPrincipal.alt = nombre;
    }

    if (contenedorImagen) {
        contenedorImagen.onclick = () => {
            const visor = document.querySelector(".visor-imagen");
            const imgGrande = document.querySelector(".visor-imagen-grande");
            if (visor && imgGrande && imagenPrincipal) {
                imgGrande.src = imagenPrincipal.src;
                imgGrande.alt = imagenPrincipal.alt;
                visor.classList.add("activo");
                visor.setAttribute("aria-hidden", "false");
            }
        };
    }

}

function configurarSeleccionProductos() {

    const tarjetas = document.querySelectorAll(".producto");

    tarjetas.forEach(tarjeta => {

        tarjeta.setAttribute("tabindex", "0");

        const manejarSeleccion = () => {

            const nombre = tarjeta.querySelector("h3")?.textContent.trim() || "Mochila ODEREY";
            const precioTexto = tarjeta.querySelector("p")?.textContent.trim() || "$0";
            const precio = parseFloat(precioTexto.replace("$", "").replace(",", ".")) || 0;
            const imagen = tarjeta.querySelector("img")?.getAttribute("src") || document.querySelector(".imagen-principal img")?.getAttribute("src") || "";

            actualizarProductoDestacado({ nombre, precio, imagen });            mostrarDetalleProducto(true);
            tarjetas.forEach(item => item.classList.toggle("seleccionado", item === tarjeta));
            document.querySelector(".producto-destacado")?.scrollIntoView({
                behavior: "instant",
                block: "start"
            });
        };

        tarjeta.addEventListener("click", evento => {
            if (evento.target.closest(".boton-producto")) return;
            manejarSeleccion();
        });

        tarjeta.addEventListener("keydown", evento => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                manejarSeleccion();
            }
        });

    });

    mostrarDetalleProducto(false);

}

function configurarBotonDestacado() {

    const boton = document.querySelector(".boton-principal");

    if (!boton) return;

    boton.addEventListener("click", () => {

        const nombre = document.querySelector(".producto-info-detallada h1")?.textContent.trim() || "Bolso táctico";
        const precioTexto = document.querySelector(".precio-actual")?.textContent.trim() || "$0";
        const precio = parseFloat(precioTexto.replace("$", "").replace(",", ".")) || 0;
        const imagen = document.querySelector(".imagen-principal img")?.getAttribute("src") || "";

        carrito.push({
            id: Date.now() + Math.random(),
            nombre,
            precio,
            imagen
        });

        guardarCarrito();
        actualizarContador();

        const textoOriginal = boton.textContent;
        boton.textContent = "✓ AGREGADO";
        boton.classList.add("agregado");

        setTimeout(() => {
            boton.textContent = textoOriginal;
            boton.classList.remove("agregado");
        }, 1200);

    });

}

/* INICIAR */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        configurarProductos();
        configurarSelectorProducto();
        configurarSeleccionProductos();
        configurarBotonDestacado();

        configurarBotonCarrito();

        actualizarContador();

        mostrarCarrito();

    }
);
