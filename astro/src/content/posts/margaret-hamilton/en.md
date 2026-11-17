---
title: "Margaret Hamilton, the person who created our trade and made it possible to look at the stars"
excerpt: "The woman who knew how to think outside the box and made the journey to the Moon possible. She is the mirror in which all of us who love software should look at ourselves: Margaret Hamilton."
date: "2026-10-19"
category: "codigo-y-gestion"
tags: ["iahoraque","inteligencia-artificial"]
lang: "en"
translated: true
original: "https://soynando.com/margaret-hamilton/"
cover: {"src":"./cover.jpg","tone":"./cover.tone.webp","w":1600,"h":1067,"alt":"Barack Obama presents the Presidential Medal of Freedom at the White House, on 22 November 2016","credit":"Lawrence Jackson, fotografía oficial de la Casa Blanca. Dominio público, vía Wikimedia Commons."}
---

20 July 1969. The lunar module <em>Eagle</em> is descending towards the Sea of Tranquility, with about seven minutes left before it touches down, when Neil Armstrong tells Houston: “Program alarm”. Four seconds later he specifies: “It’s a 1202”. The editors of the <a href="https://www.apollojournals.org/alsj/a11/a11.landing.html">Apollo Lunar Surface Journal transcript</a> noted that he said it with a slight edge of urgency, and it’s understandable: the next thing he does is ask <a href="https://es.wikipedia.org/wiki/Buzz_Aldrin">Buzz Aldrin</a> what that is and ask the ground to explain it to them.

Nobody in the cabin knows what a 1202 is.

In Houston they have to decide quickly whether to abort the landing. But I’m going to leave the spacecraft there for a moment, hanging over the Moon with the alarm lit, because what made the answer possible was not decided in Houston, nor that afternoon. It was written years earlier, in a laboratory in Cambridge (Massachusetts), by a team that programd on the assumption that something was going to go wrong. And to understand why they thought that way, you have to meet a four-year-old girl who started playing with what she shouldn’t.

That girl’s mother was called <strong>Margaret Hamilton</strong>, she led the team that wrote the onboard software, and she died last 30 September, aged 90, according to <a href="https://news.mit.edu/2026/margaret-hamilton-computing-pioneer-dies-1007">the MIT News note</a>.

## A trade that did not yet have a name

Hamilton was born in Paoli (Indiana) in 1936 and graduated in Mathematics from Earlham College in 1958. The following year she arrived at MIT to program weather forecasts with Edward Lorenz; in 1961 she worked on SAGE, the air defence system at Lincoln Laboratory, and in 1965 she was the first programr hired for Apollo at MIT’s Instrumentation Laboratory. She ended up leading the software engineering division that wrote the onboard flight software, for both the command module and the lunar module. More than four hundred people ended up working on the Apollo software.

And here comes what impresses me most: that trade had yet to be invented. Computer science degrees were only just beginning (Purdue opened the first department in the United States in 1962), there were no established methods, and what you learned you learned by getting it wrong. “We had no choice but to be pioneers,” she recalled.

<figure class="fig"><picture><source srcset="/img/blog/posts/margaret-hamilton-7.avif" type="image/avif"><source srcset="/img/blog/posts/margaret-hamilton-7.webp" type="image/webp"><img src="/img/blog/posts/margaret-hamilton-7.jpg" alt="Margaret Hamilton, smiling, standing next to a stack of printed code listings that reaches the height of her head" width="1600" height="1990" loading="lazy" decoding="async"></picture><figcaption>Margaret Hamilton next to the listings of the Apollo onboard software, at MIT’s Instrumentation Laboratory (1969) · Draper Laboratory, restored by Adam Cuerden. Public domain, via <a href="https://commons.wikimedia.org/wiki/File:Margaret_Hamilton_-_restoration.jpg">Wikimedia Commons</a>.</figcaption></figure>

## The key nobody was meant to press

Some weekends she took her daughter, Lauren, to the laboratory. One day, playing with the command module simulator, the girl pressed keys (what any four-year-old would do faced with so many buttons) and launched the <strong>P01</strong> program, meant only to prepare the spacecraft before lift-off, with the simulator in full flight.

The simulator crashed.

Anyone else would have laughed and restarted it. Hamilton stayed thinking: if it had happened to a girl playing, it could happen to a tired astronaut. She proposed adding a safeguard against that error to the software.

The answer was no: astronauts don’t make mistakes. All she achieved was a note in the documentation: do not select P01 during flight.

December 1968, in the middle of the <strong>Apollo 8</strong> journey. Jim Lovell selects P01 by accident, and the spacecraft’s navigation data is wiped.

Hamilton’s team found a way to reload it from the ground. And afterwards, at last, the safeguard she had asked for went into the program.

Today we call that <strong>defensive programming</strong>: writing code on the assumption that someone, someday, will press the wrong key, and that the system has to withstand it. Anyone who has built a web form has learned it in their own way (sooner or later, someone types letters into the phone field). The difference is that her user was in space.

## Respecting code as much as an architect respects the plans of a bridge

In those years, Hamilton began to call her work <strong>“software engineering”</strong>, and at first the expression got a laugh. Once again she had to convince others of something she saw perfectly clearly. Mind you, she didn’t invent it: it appears in a magazine in 1965, in a letter from Anthony Oettinger, president of the ACM, in 1966, and it became popular at a NATO conference in 1968. What she did was something else, and in my view harder: fight so that the expression would mean something, so that software would be held to the same rigour as a bridge or a rocket. She tells it herself in an interview recorded by Draper, the laboratory that hers became when it separated from MIT:

<figure class="video"><yt-facade video="uGqIjYzmAXc" title="Margaret Hamilton on Software Engineering" start="16"></yt-facade><figcaption>Margaret Hamilton talks about software engineering (in English, 2 min, 2019) · <a href="https://www.youtube.com/@hackthemoon2449">Hack the Moon</a>, the Draper Laboratory’s channel, on <a href="https://www.youtube.com/watch?v=uGqIjYzmAXc&amp;t=16s">YouTube</a>.</figcaption></figure>

## Twenty-seven seconds in Houston

Remember we left the <em>Eagle</em> hanging, don’t you? Well, to understand the 1202 you need to know how little fitted in that computer: a box of about 32 kilos with about 4 KB of working memory and about 72 KB of fixed memory, in which the<a href="https://terceravia.mx/2021/01/las-mujeres-tejedoras-que-abrieron-paso-a-las-computadoras-modernas/"> program was woven by hand, thread by thread, into ropes of magnetic cores</a>. Any mobile phone today has millions of times more (and we use it to check the weather).

The alarms that sounded during the descent (five in total: four 1202s and one 1201) did not come from a fault. The rendezvous radar, which wasn’t needed for landing, had its switches in a position nobody had foreseen and, because of a mismatch in the power supply, its electronics flooded the computer with useless signals. It was stealing computing time just when the computer needed it most.

Look closely, because it’s the same story. The wrong key again, only this time it wasn’t a key: it was a switch in a position that was in no plan.

A computer that treated all tasks equally would have jammed. This one didn’t, because the part of the software that shared out the work, the Executive, worked by <strong>priorities</strong>. When it ran out of room for new tasks, it restarted, relaunched only the essential jobs (the descent guidance and the astronauts’ displays) and dropped the ones that could wait. The 1202 was the computer warning that it was overloaded and that it was taking care of what mattered.

In Houston, the controller Steve Bales, helped by Jack Garman, who had the list of alarms, decided that they could carry on. Charlie Duke passed it on to the crew twenty-seven seconds after the first alarm: “We’re go on that alarm” (we’re going ahead despite that alarm). The alarms kept sounding and the answer was the same. At 102 hours, 45 minutes and 40 seconds of mission time, the <em>Eagle</em> touched down on the Sea of Tranquility. Don Eyles, who wrote part of the descent software, tells it in detail in <a href="https://news.mit.edu/2009/apollo-eyles-0717">his recollections for MIT News</a>.

The whole code, by the way, can be read today: it is <a href="https://github.com/chrislgarry/Apollo-11">published on GitHub</a>, with its original comments.

## What is saved when you can’t cope with everything

What is admirable about Hamilton is that she didn’t program as if the error were not going to come; she programd expecting it. The girl’s, the astronaut’s, the one from the switch nobody foresaw. Preparing for chaos, for error, creating a new discipline, inventing a way of making the most important historic milestone of the twentieth century possible.

She received NASA’s Exceptional Space Act Award in 2003 and the Presidential Medal of Freedom in 2016 (the one in the photo above). Of those years she said: “<a href="https://margarethamilton.dev/">Looking back, we were the luckiest people in the world</a>”. I would say that the luck, for the most part, was ours, the rest of us.

The news of her death was confirmed by her daughter, Lauren. The same girl who, aged four, pressed the key nobody should press.
