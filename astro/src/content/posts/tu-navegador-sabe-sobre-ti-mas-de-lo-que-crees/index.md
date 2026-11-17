---
title: "Huella digital, regalas diariamente datos de tu vida sin tu consentimiento"
excerpt: "La huella digital es la recopilación de todos los datos que vas dejando por la red, la mayoría de las veces sin tu consentimiento y otras con ¿tu consentimiento?"
date: "2020-11-02"
category: "codigo-y-gestion"
tags: []
lang: "es"
translated: false
original: "https://soynando.com/tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees/"
cover: {"src":"./cover.jpg","tone":"./cover.tone.webp","w":1600,"h":1067,"alt":"Candado atado con un débil cable oxidado","credit":"Foto de Markus Winkler en <a href=\"https://unsplash.com\" rel=\"noopener\">Unsplash</a>."}
---

La huella digital es la recopilación de todos los datos que vas dejando por la red, la mayoría de las veces sin tu consentimiento y otras con ¿tu consentimiento? Al finalizar el artículo te aseguro que tomarás conciencia sobre tus datos en internet y te sugeriremos algunas soluciones para mitigar un poco esa cesión de datos.

## Así eres usando internet, y lo sabes 😀

Imagínate a una persona normal en su uso de internet, mejor aún, pongámosle un nombre ficticio, por ejemplo, podrías llamarle María Segura. María Segura es una persona despreocupada, joven, de unos 31 años, amante del fútbol y las películas americanas de estreno.

Visita todos los días una página de noticias y rumores especializada en su equipo de fútbol favorito. Hace clic frecuentemente en enlaces a artículos de actualidad y humor que sus amigos le mandan a uno de sus 20 grupos de WhatsApp. María está encantada, porque algunas tardes se echa en el sofá a ver pelis de estreno; un compañero de trabajo le recomendó una web para ver las películas de estreno en streaming gratis y sin tener que descargar nada. Le gusta la comodidad de comprar por internet desde el móvil, es tan apasionada de las tiendas online de ropa de buena calidad y precios bajos, que incluso a veces le llegan paquetes que no recuerda haber comprado :D.

Cada vez que alguien le habla de datos y privacidad en internet, ella rehúye, prefiere no saber, dice frecuentemente: “Además, si yo no tengo nada que ocultar, que tomen los datos que quieran” aunque en el fondo está un poco preocupada por su desconocimiento, sin embargo, siente una falsa seguridad al saber que todos sus conocidos tienen el mismo poco conocimiento que ella sobre este tema.

## ¿Qué es eso de la huella digital? 🕵️‍♂️

El tipo y marca de dispositivo desde el que navegas, fecha/hora de cada visita, idioma, el nivel de batería, saber si estás cargándola y por tanto el tiempo que te queda para que se te apague. Son sólo algunos datos básicos que sin ningún tipo de restricción cualquier web puede saber de ti.

En la siguiente tabla he creado una clasificación, sobre algunos tipos de datos que tu navegador puede recoger de ti cada vez que navegas por la red. La web de turno puede almacenarlos y hacer tu perfil con ellos: es lo que llamamos “huella digital”.

### Navegador sin ceder permisos especiales (WebAPI) {#webapi}

<figure class="table"><div class="scroll" tabindex="0" role="region" aria-label="Seguro que me olvido de alguno más "><table><thead><tr><th scope="col">DATO</th><th scope="col">DESCRIPCIÓN</th></tr></thead><tbody><tr><td>Tipo de dispositivo / Marca / Modelo</td><td>Ejemplo: Samsung Modelo Galaxy S10</td></tr><tr><td>Navegador</td><td>Chrome, Safari, Firefox…</td></tr><tr><td>Resolución de la pantalla</td><td>Algo así como la altura y la anchura de la pantalla de tu dispositivo.</td></tr><tr><td>Orientación</td><td>Horizontal o Vertical.</td></tr><tr><td>Modo Oscuro</td><td>Saber si tienes activado el modo oscuro o el modo claro en tu sistema operativo.</td></tr><tr><td>Sistema Operativo</td><td>Windows, Mac, Android, iOS…</td></tr><tr><td>Idioma</td><td>Idioma con el que configuraste el navegador</td></tr><tr><td>Fecha y hora</td><td>Día, mes, años, hora, minuto y segundo</td></tr><tr><td>Velocidad que descargas</td><td>La velocidad de tu conexión a internet (2G, 3G, 4G-5G)</td></tr><tr><td>Vibración</td><td>Hacer vibrar tu móvil/tablet</td></tr><tr><td>Memoria RAM</td><td>Pieza interna de tu dispositivo, información sobre tu memoria RAM</td></tr><tr><td>CPU</td><td>Pieza interna de tu dispositivo, información sobre tu procesador</td></tr><tr><td>GPU</td><td>Pieza interna de tu dispositivo, información sobre tu tarjeta gráfica</td></tr><tr><td>Batería</td><td>Nivel, detector si está cargando o no y tiempo restante de batería</td></tr><tr><td>Giroscopio</td><td>«Un acelerómetro es capaz de detectar que tu móvil se está moviendo en cierta dirección y con cuánta intensidad, pero dista mucho de hacerlo con la precisión necesaria hoy en día en aplicaciones como realidad virtual. Ahí es donde entra el <strong>giroscopio</strong>, que añade el registro de la <strong>rotación del dispositivo en todos sus ejes</strong>.» vía <a href="https://www.xatakandroid.com/aplicaciones-android/giroscopio-en-el-movil-estos-son-todos-los-usos-menos-conocidos">xatakandroid.com</a></td></tr><tr><td>Posición del puntero del ratón</td><td>Saber en todo momento hacia dónde apunta el puntero de tu ratón y por supuesto dónde haces clic.</td></tr><tr><td>Combinación de varios datos anteriores</td><td>Por ejemplo, podría usar los datos de posición del puntero del ratón, fecha-hora y resolución de pantalla. Con todo ello podría establecer un patrón que me indicara en qué momento del día y sobre qué zona de la web te piensas más el hacer clic.</td></tr></tbody></table></div><figcaption><em>Seguro que me olvido de alguno más </em></figcaption></figure>

### Navegador con permisos especiales cedidos por ti (WebAPI)

<figure class="table"><div class="scroll" tabindex="0" role="region" aria-label="Estos son los más conocidos, hay muchos más "><table><thead><tr><th scope="col">DATO</th><th scope="col">DESCRIPCIÓN</th></tr></thead><tbody><tr><td>Ubicación</td><td>Acceso al GPS de tu dispositivo, es muy preciso, puede determinar el país, ciudad, barrio, calle y número de calle en la que te encuentras</td></tr><tr><td>Cámara</td><td>Acceso completo a las cámaras de tu dispositivo</td></tr><tr><td>Micrófono</td><td>Acceso completo al micrófono de tu dispositivo</td></tr><tr><td>Notificaciones</td><td>Las típicas notificaciones, mensajitos que salen en tu dispositivo cada vez que hay una novedad. <a href="https://paullambi.com/blog/notificaciones-web-push-guia-para-principiantes/">Aquí un ejemplo en la web</a></td></tr><tr><td>Acceso a archivos internos</td><td>Le das permiso para que acceda a los archivos internos del dispositivo, generalmente para almacenar o recuperar archivos.</td></tr></tbody></table></div><figcaption><em>Estos son los más conocidos, hay muchos más </em></figcaption></figure>

## Otro tipo de datos más sofisticados

Quizás te suene Google Analytics, un servicio de Google instalado en la mayoría de las webs de internet, que<a href="https://www.redeszone.net/2019/08/06/cookies-propias-cookies-terceros"> identifica, recopila y almacena todos esos datos anteriormente mencionados junto a otros muchos.</a> Toda esa información les proporciona datos estadísticos y anónimos (a priori).

<blockquote><p>El objetivo del seguimiento online para las organizaciones, compañías, páginas web, etc. es lograr un conocimiento exhaustivo de sus usuarios, su comportamiento y preferencias.</p><p>Este conocimiento sirve para optimizar el uso fácil y la experiencia del usuario. También sirve para cuestiones estadísticas, de personalización, el negocio y la elaboración de perfiles, así como el marketing dirigido.</p><cite>Fuente: <a href="https://www.cookiebot.com/es/seguimiento-online/">Cookiebot.com</a></cite></blockquote>

## ¿Cómo me afecta la recopilación de esos datos en mi día a día?

En el apartado anterior quizás habrás reaccionado con indiferencia y en el mejor de los casos con incomodidad. De lo que estoy convencido es que su lectura no cambiará para nada tus hábitos al navegar por internet, por ello vuelvo a recurrir al ejemplo de nuestra ficticia María Segura para concienciaros.

…hace clic frecuentemente en enlaces a artículos de actualidad y humor que sus amigos le mandan a uno de sus 20 grupos de WhatsApp.

Ejemplo real de cómo te pueden <a href="https://maldita.es/malditobulo/20210202/whatsapp-codigo-6-digitos-sms-por-error-campana-suplantacion-de-identidad-no-hackean-telefono/">intentar engañar para quedarse con tu cuenta de WhatsApp, así como tu lista de contactos y archivos de WhatsApp</a>.

<blockquote><p>La Guardia Civil de Navarra alertó en febrero a través de una nota de prensa «de una posible campaña de suplantación de identidad a través de la aplicación de mensajería móvil WhatsApp»… …según las denuncias que han recibido, los usuarios han recibido un mensaje a través de WhatsApp que les decía “Hola, lo siento, te envíe un código de 6 dígitos por SMS por error, puedes pasar a mí por favor? es urgente”.</p><cite>Fuente: <a href="https://maldita.es/malditobulo/20210202/whatsapp-codigo-6-digitos-sms-por-error-campana-suplantacion-de-identidad-no-hackean-telefono/">Maldita.es</a></cite></blockquote>

…un compañero de trabajo le recomendó una web para ver las películas de estreno en streaming gratis.

Ejemplo real de cómo las webs de dudosa reputación <a href="https://www.osi.es/es/actualidad/blog/2018/07/11/cuatro-tipos-de-publicidad-que-preferirias-no-ver">pueden jugar con tus datos a través de su publicidad</a>.

<blockquote><p>Existe una gran diferencia entre la publicidad y la publicidad engañosa, pero a simple vista, es complicado diferenciar una de otra si no disponemos de unos mínimos conocimientos… …Muchos ciberdelincuentes aprovechan la publicidad engañosa para lucrarse a costa de los usuarios. Esta publicidad, por lo general, es más intrusiva de lo habitual e incluso a veces impide al usuario seguir con su navegación.</p><cite>Fuente: <a href="https://www.osi.es/es/actualidad/blog/2018/07/11/cuatro-tipos-de-publicidad-que-preferirias-no-ver">Oficina de seguridad del internauta</a></cite></blockquote>

…es tan apasionada de las tiendas online de ropa de buena calidad y precios bajos, que incluso a veces le llegan paquetes que no recuerda haber comprado.

El <strong>brushing </strong>es una estrategia usada por las empresas fraudulentas para generar <strong>votos positivos falsos en las reseñas de sus productos</strong>. Se aprovechan webs como Amazon o eBay <a href="https://www.lavanguardia.com/economia/20200829/483143672791/el-gobierno-alerta-de-un-nuevo-fraude-global-en-el-comercio-online.html">enviándote paquetes que no has pedido</a>.

<blockquote><p>Así que tiendas que venden sus productos a través de ellas se dedican a mandar paquetes de poco valor de forma aleatoria, hacer una cuenta falsa con el nombre y dirección del receptor y elogiar el producto posteriormente. Una técnica para la que primero necesitan los datos personales de miles de personas, sus nombres y direcciones postales, que suelen obtener de forma fraudulenta o comprándola a consultoras o anunciantes.</p><cite>Fuente: <a href="https://www.lavanguardia.com/economia/20200829/483143672791/el-gobierno-alerta-de-un-nuevo-fraude-global-en-el-comercio-online.html">La Vanguardia</a></cite></blockquote>

A María le gusta usar Uber o Cabify para moverse por la ciudad, ¿qué pasaría si saber el nivel de batería le afectara a su bolsillo?

Ejemplo real, el caso de <a href="https://www.elconfidencial.com/tecnologia/2019-12-08/uber-cabify-taxi-apps-aplicaciones_2361571/">Uber, quien presuntamente hace que pagues más por el servicio si tienes poca batería</a>.

<blockquote><p>«En la mayoría de los casos el precio de un mismo trayecto era el mismo, salvo en viajes que se dirigían a puntos de interés (estadios). Estas variaciones eran mínimas pero <strong>siempre que se producían el precio era superior en el dispositivo de menor batería</strong>«. El informe incluye pantallazos de las pruebas en las que, con diferencias de entre 10 y 20 céntimos de euro, los precios casi siempre son mayores en el móvil con poca batería.</p><cite>Fuente: <a href="https://www.elconfidencial.com/tecnologia/2019-12-08/uber-cabify-taxi-apps-aplicaciones_2361571/#doc_13210">El Confidencial</a></cite></blockquote>

Ella cuenta su vida en Facebook, y nunca se ha parado a mirar cómo ven los demás su perfil o el tipo de datos que ponen públicos en su muro.

Ejemplo real, el caso de <a href="https://www.adslzone.net/noticias/redes-sociales/facebook-filtracion-datos-desarrolladores-90-dias/">Facebook suma y sigue: volvió a compartir tus datos personales</a>.

<blockquote><p>Según las estimaciones de la red social capitaneada por Mark Zuckerberg, hasta 5.000 desarrolladores han podido seguir accediendo a los datos privados de los usuarios durante más de 90 días desde que se reconoció la inactividad. Entre los datos que pueden haber recibido tenemos nuestro<strong> idioma o sexo</strong>, aunque es posible que no se esté revelando toda la verdad y pueda ser algún dato más.</p><cite>Fuente: <a href="https://www.adslzone.net/noticias/redes-sociales/facebook-filtracion-datos-desarrolladores-90-dias/">adslzone.net</a></cite></blockquote>

## Cosas sencillas que puedes hacer para mejorar tu privacidad

La seguridad tanto fuera como dentro de internet nunca es 100%. Si dejas la ventana abierta de casa cuando te vas de vacaciones, es más probable que puedan desvalijarte la casa; de la misma forma podemos intentar <strong><strong>ponérselo más difícil a los ladrones de tus datos</strong></strong>.

### Proyecto IKAY

Como programador con muchos años a mis espaldas trabajando en el mundo de internet, <a href="https://nandomunoz.github.io/ikay">me fue sencillo desarrollar el proyecto IKAY (I know about you</a>). IKAY es una web donde te muestro de forma sencilla los <em><a href="#webapi">datos más básicos</a></em> que cualquier web puede saber de ti, unido a recomendaciones para evitar su filtración en la medida de lo posible.

<figure class="fig"><picture><source srcset="/img/blog/posts/tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees-36.avif" type="image/avif"><source srcset="/img/blog/posts/tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees-36.webp" type="image/webp"><img src="/img/blog/posts/tu-navegador-sabe-sobre-ti-mas-de-lo-que-crees-36.jpg" alt="" width="1500" height="500" loading="lazy" decoding="async"></picture></figure>

Todos los datos que aparecen en IKAY únicamente se almacenan en tu dispositivo, en ningún momento son enviados a ningún servicio externo, ¿Por qué? Porque no me interesan tus datos, me interesa tu concienciación.

### Consejos sobre el uso de WhatsApp

WhatsApp es una red social introducida en nuestras vidas de manera muy natural. Por todo ello hemos de ser más precavidos sobre cómo la utilizamos y sobre todo no hacer clic en cualquier enlace que nos envíen.

El periódico <a href="https://www.abc.es/tecnologia/consultorio/abci-cinco-consejos-para-mejorar-seguridad-cuenta-whatsapp-202002130207_noticia.html">ABC nos proporciona cinco consejos para mejorar la seguridad</a> de nuestro WhatsApp:

- Usa la verificación en dos pasos
- Configura la privacidad de tu perfil
- Chequea la configuración de los grupos
- Si tienes un móvil moderno usa Touch ID o Face ID
- Actualiza esta y todas tus aplicaciones de tu móvil

### Cómo evitar la publicidad dañina y el seguimiento por internet

Cuando un servicio en internet es gratuito, tú eres el producto. El modelo de negocio más usado en la red es la publicidad, pero no siempre se caracterizan por la ética. <a href="https://www.pcworld.es/tutoriales/internet/evitar-rastreo-online-3788194/">PCWorld</a> nos aconseja seguir estos puntos para evitar el rastreo de nuestro perfil usado para mostrarnos publicidad:

- Quita los anuncios personalizados en las apps de Google
- Bloquea cookies de terceros
- Activa ‘No realizar seguimiento’ en tu navegador
- Navega en privado
- Usa extensiones de navegador anti-rastreo
- Utiliza un navegador seguro (No uses Internet Explorer)

### Comprar por internet es seguro, pero necesitamos mantener ciertas precauciones

El dato más jugoso para los amantes de lo ajeno en internet es nuestra tarjeta de crédito, por ello yo siempre recomiendo poner un intermediario seguro. Bajo mi punto de vista <a href="https://www.paypal.com/es/webapps/mpp/personal">crear una cuenta de PayPal</a> es lo mejor, <a href="https://web.archive.org/web/2025/https://www.adslzone.net/2017/02/12/mas-seguro-pagar-paypal/">sobre todo cuando compras por primera vez</a> en una web nueva.

<blockquote><p>Con el aumento de los compras online y las plataformas comercio electrónico, también crecen los intentos por robar nuestros datos y los timos por parte de los ciberdelincuentes.</p><cite>Fuente: <a href="https://www.osi.es/es/actualidad/blog/2019/06/19/como-comprar-online-y-no-caer-en-el-intento">OSI</a></cite></blockquote>

- Tener instalado un antivirus actualizado.
- Si usas móvil/tablet compra desde su app oficial
- Compra con el wifi de casa, evita conectarte a redes públicas
- Revisa la información clave de la tienda online: quiénes son, domicilio fiscal, formas de pago, políticas de envío y políticas de devolución
- Si tienes dudas, nunca compres ahí
- Si es demasiado bueno para ser verdad, seguro que es un fraude

### Las redes sociales son el reflejo de los datos que le das diariamente

<strong>Nunca digas en las redes sociales nada que no dijeras en la vida real en público.</strong>

<em>¿Gritarías en medio de la plaza del pueblo que te vas de vacaciones o que vas a estar tres horas fuera de casa porque estás en un restaurante? </em>Entonces ¿por qué te sorprende que los delincuentes digitales estén atentos y lean tus redes sociales para recabar información sobre ti?

¿Le dirías a un desconocido por la calle: tu ideología política, cómo te sientes hoy, cuando conociste a tu novio, que estás embarazada, día, mes año y hora de nacimiento, nombre con apellidos completo…? Entonces ¿por qué le das esa información a Facebook?

Otro hábito saludable es revisar las <strong>configuraciones de privacidad de las redes sociales</strong>:

- Cómo configurar tu privacidad en Facebook
- <a href="https://www.osi.es/es/actualidad/blog/2014/04/21/seguridad-y-privacidad-en-redes-sociales-ii-twitter-todo-lo-que-debes-sab">Cómo configurar tu privacidad en Twitter</a>
- <a href="https://elandroidelibre.elespanol.com/2019/04/opciones-privacidad-whatsapp.html">Cómo configurar tu privacidad en WhatsApp</a>
- <a href="https://elandroidelibre.elespanol.com/2020/02/los-mejores-ajustes-para-privacidad-en-instagram.html">Cómo configurar tu privacidad en Instagram</a>
- <a href="https://dataseg.es/proteccion-de-datos/configura-tu-privacidad-en-linkedin/">Cómo configurar tu privacidad en LinkedIn</a>
- <a href="https://www.xataka.com/basics/como-mejorar-privacidad-youtube">Cómo configurar tu privacidad en YouTube</a>

## Conclusión

Internet es un lugar maravilloso donde aportar conocimiento, aprender, informarse, comunicarse o comprar. Por ello no debemos tenerle miedo, sino ser consciente del valor de nuestros datos. Existen <a href="https://es.wikipedia.org/wiki/Reglamento_General_de_Protecci%C3%B3n_de_Datos">personas e instituciones que velan por la seguridad de los mismos</a>, démosle la importancia que tienen y podremos manejar los retos del siglo XXI.
