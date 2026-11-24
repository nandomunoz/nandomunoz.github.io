---
title: "How to create AI skills: a guide for beginners"
excerpt: "An AI skill is just a folder with a SKILL.md file. How to create your own for Claude Code or Codex, check that it works and avoid the typical mistakes."
date: "2026-11-24"
category: "codigo-y-gestion"
tags: ["inteligencia-artificial","asistentes-de-codigo"]
lang: "en"
translated: true
original: "https://nandomunoz.com/blog/como-crear-skills/"
cover: {"src":"./cover.jpg","tone":"./cover.tone.webp","w":1536,"h":1024,"alt":"A white jigsaw piece, standing on a light grey background, in front of a circle of light onto which the silhouette of the same piece is projected","credit":"Nando Muñoz, imagen generada con IA."}
---

I'm sure it has happened to you. You open a conversation with your coding assistant and, once again, you explain the same thing: “commit messages go in English and in the imperative”, “tests are named like this”, “run the linter before opening a PR”. Tomorrow, in another conversation, you explain it all over again.

A **skill** is the way to stop repeating yourself. And the best part is that, inside, it is quite a lot less than you imagine: **a folder with a text file**. No framework, no server, nothing to install.

In this article I tell you what a skill is, how to create your own for assistants such as Claude Code or Codex, how to check it works and which mistakes to avoid. It is meant for beginners: you need to know your way around a terminal and to have seen a Markdown file, and little more.

## What is a skill?

It is a folder that contains, at the very least, a file called `SKILL.md`. That file has two parts: at the top, a few pieces of data in [YAML](https://www.ibm.com/think/topics/yaml), a `key: value` text format (the [*frontmatter*](https://docs.github.com/en/contributing/writing-for-github-docs/using-yaml-frontmatter)) and, below, the instructions written in Markdown, the way you would explain them to a new colleague.

The idea is that the assistant does not read all your skills at once. It only knows the name and a short description of each one. When you ask it for something that matches the description, it then opens the whole file and follows the instructions. It is like having a procedures manual on a shelf: you don't know it by heart, but you know where to look when the time comes.

<div class="luz-alert luz-alert--info" role="note">
<div class="luz-alert__body">There is one detail that matters: it is not the invention of a single tool. It is <a href="https://agentskills.io/specification">the open Agent Skills standard</a>, created by Anthropic and read today by many assistants, such as Claude Code or Codex.</div>
</div>

### How is it different from a prompt or an `AGENTS.md`?

All three are for telling the assistant how to work, but they are used at different moments:

<figure class="table"><div class="scroll" tabindex="0" role="region" aria-label="Three ways to tell the assistant how to work"><table>
<thead><tr><th scope="col">What it is</th><th scope="col">When it is loaded</th><th scope="col">What it is for</th></tr></thead>
<tbody>
<tr><td>A prompt</td><td>When you write it, every time</td><td>A one-off request</td></tr>
<tr><td><code>AGENTS.md</code> (or <code>CLAUDE.md</code>)</td><td>Always, in every request</td><td>Facts about the project: “we use pnpm”, “the tests are in <code>tests/</code>”</td></tr>
<tr><td>A skill</td><td>Only when needed</td><td>Procedures: “this is how a release is prepared”</td></tr>
</tbody></table></div><figcaption><em>Three ways to tell the assistant how to work</em></figcaption></figure>

The practical difference is the cost. Whatever is in `AGENTS.md` takes up space in the assistant's context in every request. A skill costs about a hundred <a href="/en/blog/introduccion-a-la-ia/#what-is-inside">tokens</a> until it is activated.

*A simple rule to decide: if part of your `AGENTS.md` has stopped being a fact and has turned into a recipe with steps, it is a skill you haven't moved into its own folder yet.*

## How do I create my first skill, step by step?

Creating a skill takes four steps: create the folder, write the `SKILL.md`, test it and iterate. Let's go through them with an example one, which helps you write commit messages. It doesn't have to be this one; it is there to show the process.

<luz-timeline class="timeline--wide" aria-label="The four steps to create the example skill">
<ol class="luz-timeline">
<li class="luz-timeline__item"><span class="luz-timeline__date">Step 1</span><p class="luz-timeline__title">Create the folder</p><p class="luz-timeline__text">In Claude Code, a project's skills live in <code>.claude/skills/</code>; other tools read <code>.agents/skills/</code>.</p><pre><code class="language-bash">mkdir -p .claude/skills/commit-messages</code></pre></li>
<li class="luz-timeline__item"><span class="luz-timeline__date">Step 2</span><p class="luz-timeline__title">Write the <code>SKILL.md</code></p><p class="luz-timeline__text">With the frontmatter at the top and the instructions below:</p><pre><code class="language-markdown">---
name: commit-messages
description: "Writes clear commit messages following the team's conventions. Use it when asked to make a commit or review a commit message. Do not use it for PRs or for git history."
---&#10;
# Commit messages&#10;
1. Look at what has changed with `git diff --staged`.
2. Write the title in English, in the imperative and under 72 characters
   (“Add login form”, not “Added login form”).
3. If the change needs explaining, leave a blank line and explain
   the why, not the what: the diff already shows the what.
4. Show the message to the user and wait for their approval before making the commit.</code></pre></li>
<li class="luz-timeline__item"><span class="luz-timeline__date">Step 3</span><p class="luz-timeline__title">Test it</p><p class="luz-timeline__text">Ask it for something that fits: “commit what I have staged”. If the description is well written, the assistant should use the skill. In Claude Code you can also call it by hand by typing <code>/commit-messages</code>.</p></li>
<li class="luz-timeline__item"><span class="luz-timeline__date">Step 4</span><p class="luz-timeline__title">Iterate</p><p class="luz-timeline__text">Look at what it got wrong and fix the file, not the conversation. If it didn't activate, refine the description. If it activated but did something odd, refine the body.</p></li>
</ol>
</luz-timeline>

### What is inside a skill and its `SKILL.md`?

This is the full structure. Only the first file is required:

```text
my-skill/
├── SKILL.md        # required: data + instructions
├── references/     # optional: documents read only when needed
├── scripts/        # optional: programs the assistant runs
└── assets/         # optional: templates and other resources
```

The frontmatter has **six fields**, and only two are required:

<figure class="table"><div class="scroll" tabindex="0" role="region" aria-label="The six frontmatter fields"><table>
<thead><tr><th scope="col">Field</th><th scope="col">Required?</th><th scope="col">What it is</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>Yes</td><td>The name. Maximum 64 characters, only lowercase letters, numbers and hyphens, and <strong>the same as the folder name</strong></td></tr>
<tr><td><code>description</code></td><td>Yes</td><td>What the skill does and when to use it. Maximum 1,024 characters</td></tr>
<tr><td><code>license</code></td><td>No</td><td>The licence</td></tr>
<tr><td><code>compatibility</code></td><td>No</td><td>What it needs to work (Node, network access, a specific program…)</td></tr>
<tr><td><code>metadata</code></td><td>No</td><td>Extra data, such as a version written as text</td></tr>
<tr><td><code>allowed-tools</code></td><td>No</td><td>Pre-approved tools. It is experimental</td></tr>
</tbody></table></div><figcaption><em>The six frontmatter fields</em></figcaption></figure>

Notice what is **not** there: there is no `id` field, no `version`, no `instructions`. The instructions are simply the body of the file.

#### What does it mean that it loads “in levels”?

It is the trick that lets you have dozens of skills without filling the assistant's head:

1. **Always loaded:** the `name` and `description` of each skill (about a hundred tokens).
2. **When activated:** the body of `SKILL.md`. It is recommended not to go beyond about 500 lines.
3. **Only when needed:** the files in `references/`, `scripts/` and `assets/`.

That is why it is a good idea for `SKILL.md` to be short and to point to other files for the details: “read `references/api-errors.md` if the API returns anything other than a 200”.

### How do I write a description so the skill activates?

If you are only going to take care of one thing, make it this. The description is the only thing the assistant sees of your skill until it decides to use it. If it is vague, the skill doesn't activate when it should. If it is too broad, it activates when it shouldn't.

A good description answers three questions: what it does, when to use it and when **not** to use it.

```yaml
# Bad: helps with what? when?
description: Helps with commits.

# Better
description: "Writes clear commit messages following the team's conventions. Use it when asked to make a commit or review a commit message. Do not use it for PRs or for git history."
```

**Watch out for the quotes in the second example. If the description contains a colon (`: `) and you don't put it in quotes, some programs accept it and others reject it as invalid YAML. Always put the description in quotes and you'll save yourself the problem.**

### What do I write in the body?

This is where it shows whether you thought about the reader or not. Some guidelines the guides keep repeating:

- **Tell it only what the assistant is missing.** Ask yourself: “would it get this wrong without this instruction?”. If the answer is no, remove it.
- **Give defaults, not menus.** “Use pytest” works better than “you can use pytest, unittest or nose”.
- **Write procedures, not statements.** Numbered steps rather than general descriptions.
- **Put the most important thing first.** In some tools, when the conversation is compacted (summarised to make room), only the first few thousand tokens of each skill are kept.
- **Tell it when to read each extra file,** instead of leaving everything mixed together.

A sentence from <a href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices">Anthropic's best practices guide</a> sums it up well: the context window is a public good. Everything you write competes for that space with the rest of the conversation.

### When do I need a script?

Many skills don't need one: they are just instructions, and that's fine. A script is worth it when an operation is **fragile** or has to be done the same way every time: validating a format, working out a path, writing a file with an exact structure.

The rule is the one about degrees of freedom. When there are several valid ways to do something, let the assistant decide with text. When there is only one correct way, give it a script and don't let it improvise.

If you write a script that an assistant is going to run, bear in mind that **it can never sit waiting for someone to type something**. A script that asks “continue? (y/n)” hangs forever. Some habits that help:

- Take the data as arguments (`--name`, `--dry-run`), not as questions.
- Have a short `--help` with examples.
- If it fails, say what failed, what you expected and what can be tried.
- Write the result to standard output and the warnings to standard error.
- Offer a `--dry-run` that shows what it would do without doing it.
- Use different exit codes: 0 if it goes well, 1 if it found problems, 2 if you used it wrongly.

### How do I know my skill works?

There are two different questions, and it's best not to mix them up.

**Does it activate when it should?** Write about five sentences that should activate it and another five that shouldn't. The most useful of the ones that shouldn't activate it are those that *almost* fit (“review the git history”, in our example). Try each sentence a few times and note down how many times it gets it right.

**Does it do what you want when it activates?** Here the useful comparison is with and without the skill: ask for the same thing twice, once with the skill and once without it, and see what changes. Whenever you can, check the result with code (is the message under 72 characters?) rather than by eye.

<div class="luz-alert luz-alert--info" role="note">
<div class="luz-alert__body">A sentence from the <a href="https://code.claude.com/docs/en/skills#evaluate-and-iterate-on-a-skill">Claude Code documentation</a> makes it clear: seeing that a skill activates proves the assistant found it, not that it did what you wanted.</div>
</div>

## What should I be careful about with security?

Much more than it seems. A skill is text the assistant obeys, and it can include scripts that run with **your permissions**. Installing someone else's skill is, in practice, installing software.

- **Read every file** of a third-party skill before using it, not just the `SKILL.md`.
- **Be wary of ones that download things from the internet** while they run.
- **Don't assume `allowed-tools` protects you.** It pre-approves tools, but it doesn't stop others from being used.
- If a skill **writes files for you**, it's better for a script with `--dry-run` to do it and for the assistant to show you what it is going to write before doing so.
- Whatever must **always** be followed, don't leave it only in the skill's text: it can be forgotten or ignored. Put it in a mechanism that enforces it (in Claude Code, a *hook*: a command that Claude Code runs on its own at specific moments).

## Does it work the same in Claude Code, Codex and other assistants?

Partly. The folder and the `SKILL.md` travel well. What surrounds the skill, not so much:

**Travels between tools:**

- The folder, the `SKILL.md` and the six fields
- Markdown and relative paths
- `AGENTS.md`

**Specific to each one:**

- How it is invoked by hand (`/name` in Claude Code, `$name` in Codex)
- The extra frontmatter fields
- Subagents, hooks and plugins
- The tool for asking you questions

<div class="luz-alert luz-alert--info" role="note">
<div class="luz-alert__body">If your skill uses a field specific to one tool, the others ignore it without warning, and in some places (such as when uploading it to claude.ai) an extra field is an error. If you want it to be portable, stick to the six fields of the standard and write the instructions in plain text.</div>
</div>

## What mistakes does almost everyone make?

- **A vague description.** “Helps with code” tells the assistant nothing. Say what it does, when and when not.
- **A colon without quotes in the description.** It works in your tool and fails in another.
- **A `name` different from the folder name.** Some clients tolerate it; others don't load the skill.
- **Putting everything in `SKILL.md`.** If it goes beyond about 500 lines, split it into `references/`.
- **Misspelling a field.** Many tools silently ignore what they don't recognise, so an `allowed_tools` with an underscore doesn't throw an error: it simply does nothing.
- **Accepting a skill because it activates.** Activating doesn't prove it does what you wanted.
- **A script that asks questions.** If it waits for you to type something, the assistant sits waiting forever.

## This is all very well, but isn't there a simpler way?

<blockquote><p>The simplest way to do it is to ask your model to create the skill: you explain it and, most importantly, you check how it has done it yourself :)!</p></blockquote>

And to start, pick something small that already annoys you. Think of the last thing you explained twice to your assistant and turn it into a twenty-line skill. Write a good description, test it with a few sentences that should trigger it and a few that shouldn't, and fix whatever fails.
