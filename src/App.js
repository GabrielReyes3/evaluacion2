import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [darkTheme, setDarkTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkTheme]);

  const toggleTheme = () => setDarkTheme(!darkTheme);

  return (
    <>
      <header className="header-footer">
        <div className="container header-flex">
          <div className="logo-titulo">
            <img
              src={`${process.env.PUBLIC_URL}/DucatiLogo.png`}
              alt="Logo de Ducati"
              className="logo"
            />
            <h1>Ducati Multistrada</h1>
          </div>


        </div>
      </header>

      <nav className="header-footer">
        <div className="container">
          <ul className="nav-ul">
            <li>
              <a href="#contenido" className="nav-a">
                Ir al contenido
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main id="contenido">
        <div className="container">
          <section>
            <h2 className="centered-h2">Ducati Multiestrada: Aventura sin límites</h2>

            <p className="paragraph">
              La <strong>Ducati Multistrada</strong> es una motocicleta versátil que redefine el concepto de aventura sobre dos ruedas. Diseñada para adaptarse a una amplia variedad de condiciones, esta moto combina potencia, comodidad y tecnología de punta en una experiencia de conducción única. Su ingeniería avanzada y diseño sofisticado convierten cada trayecto en un viaje lleno de emoción y seguridad, ideal para quienes buscan explorar sin restricciones.
            </p>

            <p className="paragraph">
              Uno de sus mayores atractivos es su motor <em>V4 Granturismo</em>, que proporciona una entrega de potencia suave pero contundente. Esto permite disfrutar tanto de una conducción ágil en carreteras sinuosas como de estabilidad en trayectos largos o rutas todoterreno. Su par motor excepcional se traduce en aceleraciones inmediatas y un manejo preciso que responde con fidelidad a cada movimiento del piloto.
            </p>

            <img
              src={`${process.env.PUBLIC_URL}/ducati1.jpg`}
              alt="Motocicleta Ducati Multistrada en un camino de montaña al atardecer"
              className="img-responsive"
            />

            <p className="paragraph">
              En términos de tecnología, la Multistrada está equipada con asistencias electrónicas como control de tracción, ABS en curva, modos de conducción, control crucero adaptativo y radar frontal y trasero, lo que la convierte en una de las motos más avanzadas de su categoría. Todo esto se puede controlar desde una pantalla TFT a color de alta resolución, intuitiva y fácil de usar incluso bajo condiciones de luz intensa, garantizando que el piloto siempre mantenga el control total de la máquina.
            </p>

            <p className="paragraph">
              Su diseño ergonómico está pensado para ofrecer una postura cómoda durante horas de conducción, con asiento ajustable, parabrisas regulable y una posición de manejo que reduce la fatiga. Esto, combinado con suspensiones electrónicas semi-activas, permite un desempeño confiable y suave en cualquier terreno, ya sea asfalto o caminos sin pavimentar. La Multistrada se adapta a cada ruta, ajustando automáticamente la suspensión para absorber las irregularidades y mantener la máxima estabilidad.
            </p>

            <p className="paragraph">
              La Ducati Multistrada no solo es una motocicleta potente, sino también una compañera de viajes. Ya sea para rutas cortas o travesías de miles de kilómetros, esta moto ofrece seguridad, confort y la emoción característica de Ducati en cada kilómetro recorrido. Su sistema de navegación integrado y conectividad Bluetooth mantienen al piloto informado y conectado sin perder la concentración en la carretera.
            </p>

            <img
              src={`${process.env.PUBLIC_URL}/ducati2.jpg`}
              alt="Motocicleta Ducati Multistrada en un camino de montaña al atardecer"
              className="img-responsive"
            />

            <p className="paragraph">
              Cada elemento de la Multistrada refleja la pasión y el compromiso de Ducati por la excelencia. Desde sus frenos Brembo de alto rendimiento hasta su chasis ligero y resistente, esta moto está diseñada para quienes exigen lo mejor en cada aspecto. La exclusividad de sus acabados y la precisión en su fabricación hacen que conducirla sea una experiencia que despierta los sentidos y alimenta el alma aventurera.
            </p>

            <p className="paragraph">
              La seguridad es otro pilar fundamental de la Multistrada, con sistemas avanzados de asistencia al piloto que brindan confianza en cualquier condición climática o tipo de camino. El control de estabilidad y los múltiples modos de conducción permiten adaptar la moto a las necesidades del momento, desde un manejo suave y relajado hasta un rendimiento deportivo y desafiante.
            </p>

            <p className="paragraph">
              Además, su diseño estilizado y aerodinámico no solo aporta una estética impresionante, sino que también mejora la eficiencia y estabilidad a altas velocidades. Cada línea y curva están pensadas para reducir la resistencia al viento y maximizar la precisión en la conducción, haciendo que cada viaje sea tan eficiente como emocionante.
            </p>

            <img
              src={`${process.env.PUBLIC_URL}/ducati3.jpg`}
              alt="Motocicleta Ducati Multistrada en un camino de montaña al atardecer"
              className="img-responsive"
            />

            <p className="paragraph">
              En definitiva, la Ducati Multistrada es la opción perfecta para quienes buscan la combinación ideal entre tecnología avanzada, potencia emocionante y confort excepcional. Es la invitación perfecta a descubrir nuevos horizontes y vivir la aventura sin límites, sintiendo la libertad y el poder de la carretera en cada instante.
            </p>

            <p className="paragraph">
              Atrévete a desafiar lo convencional y a explorar más allá con la Multistrada, la moto que transforma cada destino en un recuerdo inolvidable y cada ruta en una historia que merece ser contada. La aventura te espera, y con Ducati Multistrada, estás listo para conquistarla.
            </p>

            <img
              src={`${process.env.PUBLIC_URL}/DucatiLogo.png`}
              alt="Logo de Ducati"
              className="logo-footer"
            />
          </section>
        </div>
      </main>

            {/* Switch flotante abajo a la derecha */}
      <div className="dark-mode-switch">
        <label className="switch" aria-label="Cambiar tema">
        <input type="checkbox" id="themeToggle" onChange={toggleTheme} checked={darkTheme} />
          <span className="slider"></span>
        </label>
      </div>

      <footer className="header-footer">
        <div className="container">
          <p className="footer-p">&copy; 2025 Ducati Multistrada .Todos los derechos reservados. Gabriel Reyes - Unidad 2</p>
        </div>
      </footer>
    </>
  );
}
