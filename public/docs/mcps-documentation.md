
# MCPS & Agents con Claude Code — Documentación completa

> **Resumen:** Documento en Markdown que explica MCPS (Multi‑Context Processing Systems), Agents, instalación y configuración de Claude Code, comandos importantes, buenas prácticas y ejemplos. Está organizado para que la complejidad aumente de forma progresiva: primero configuración básica, luego comandos y agentes, y finalmente orquestación avanzada y MCPs.

---

## Índice (Tabla de contenidos)

1. [Introducción](#introducción)  
2. [Configuración inicial de Claude](#configuración-inicial-de-claude)  
   2.1. [Instalación y autenticación](#instalación-y-autenticación)  
   2.2. [Estructura recomendada de `claude.md`](#estructura-recomendada-de-claudemd)  
   2.3. [Comandos básicos del entorno de Claude](#comandos-básicos-del-entorno-de-claude)  
   2.4. [Modelos y consideraciones](#modelos-y-consideraciones)  
3. [Comandos esenciales y Hooks](#comandos-esenciales-y-hooks)  
   3.1. [Slash commands list (útiles)](#slash-commands-list-útiles)  
   3.2. [Hooks y trucos rápidos](#hooks-y-trucos-rápidos)  
4. [MCPS — Multi‑Context Processing Systems (Grupo: MCPs)](#mcps---multi-context-processing-systems-grupo-mcps)  
   4.1. [¿Qué son los MCPs?](#qué-son-los-mcps)  
   4.2. [¿Para qué sirven?](#para-qué-sirven)  
   4.3. [Componentes habituales de un MCP](#componentes-habituales-de-un-mcp)  
   4.4. [Instalación/puesta en marcha (pasos)](#instalaciónpuesta-en-marcha-pasos)  
   4.5. [Módulos y proyectos relevantes (Context7, Sequential, Magic, Playwright)](#módulos-y-proyectos-relevantes-context7-sequential-magic-playwright)  
5. [Agents (Grupo: Agents)](#agents-grupo-agents)  
   5.1. [¿Qué es un Agent?](#qué-es-un-agent)  
   5.2. [Diferencia entre Agent, Sub‑Agent y Task‑Agent](#diferencia-entre-agent-sub-agent-y-task-agent)  
   5.3. [¿Para qué sirven? (casos de uso)](#para-qué-sirven-casos-de-uso)  
   5.4. [Cómo crear y configurar Agents](#cómo-crear-y-configurar-agents)  
   5.5. [Ejemplo práctico básico — Flujo de 4 agents](#ejemplo-práctico-básico---flujo-de-4-agents)  
6. [Comandos personalizados (Custom Commands)](#comandos-personalizados-custom-commands)  
   6.1. [Estructura de carpeta `commands`](#estructura-de-carpeta-commands)  
   6.2. [Sintaxis de ejemplo y parámetros](#sintaxis-de-ejemplo-y-parámetros)  
   6.3. [Buenas prácticas para commands reutilizables](#buenas-prácticas-para-commands-reutilizables)  
7. [Memoria (Memory Commands)](#memoria-memory-commands)  
   7.1. [Qué guardar en memoria y qué evitar](#qué-guardar-en-memoria-y-qué-evitar)  
   7.2. [Formas de almacenar memoria (proyecto vs. usuario)](#formas-de-almacenar-memoria-proyecto-vs-usuario)  
8. [SuperClaude y proyectos complementarios](#superclaude-y-proyectos-complementarios)  
   8.1. [SuperClaude Framework](#superclaude-framework)  
   8.2. [Repositorios útiles y enlaces rápidos](#repositorios-útiles-y-enlaces-rápidos)  
9. [Plugins y empaquetado del setup](#plugins-y-empaquetado-del-setup)  
10. [Flujo sugerido: De básico a avanzado (orden pedagógico)](#flujo-sugerido-de-básico-a-avanzado-orden-pedagógico)  
11. [Checklist de buenas prácticas y errores comunes](#checklist-de-buenas-prácticas-y-errores-comunes)  
12. [Ejemplos de `claude.md`, commands y agents (Plantillas)](#ejemplos-de-claudemd-commands-y-agents-plantillas)  
13. [Apéndice: Lista rápida de slash commands y atajos](#apéndice-lista-rápida-de-slash-commands-y-atajos)  
14. [Referencias y notas finales](#referencias-y-notas-finales)

---

## Introducción

Este documento está pensado como guía progresiva y práctica para que un lector —desde principiante hasta intermedio— pueda instalar, configurar y orquestar un ecosistema de Claude Code con MCPS y Agents. El orden está diseñado para enseñar primero los elementos imprescindibles (configuración y comandos), y luego profundizar en agentes, memoria, comandos personalizados y orquestación compleja.

---

## Configuración inicial de Claude

### Instalación y autenticación

- Sigue la guía oficial de Anthropic para instalar y autenticar Claude Code en tu entorno.  
- Recomendación general:
  1. Prepara un entorno (VM/WSL/Contenedor) con Node.js y/o Python (dependiendo de las herramientas que uses).
  2. Clona o instala la CLI/paquete de Claude Code que utilices.
  3. Añade variables de entorno para la clave de Anthropic (evita dejar tokens en repositorios).
  4. Ejecuta un `claude init` / `/init` según el flujo que provea tu instalación para crear el `claude.md` inicial.

### Estructura recomendada de `claude.md`

Recomiendo una cascada de archivos de contexto:

- `~/.claude/claude.md` → contexto global para tu usuario.
- `project-root/claude.md` → contexto para el proyecto.
- `project-root/features/feature-name/claude.md` → contexto por característica.

Contenido mínimo sugerido para `claude.md`:

```md
# CLAUDE.MD - Contexto del proyecto
project: NombreDelProyecto
purpose: "Mantener el estilo y reglas para generar/analizar/iterar sobre código"
agents:
  - arquitecto
  - constructor
  - validador
  - scribe
rules:
  - "Respeta el límite de tokens y solicita contexto si falta"
  - "Prioriza tests y documentación"
```

### Comandos básicos del entorno de Claude

- `/clear` — limpia la sesión.  
- `/compact` — resume historial para ahorrar tokens y mantener foco.  
- `/statusline` — muestra o configura la línea de estado.  
- `/model` — ver o cambiar el modelo activo (p. ej. `Sonnet 4`, `Opus 4`).  
- `shift+tab` — alterna modos (plan, accept, common) en la UI (según cliente).  
- `/init` — inicializa `claude.md` o la estructura base del proyecto.

### Modelos y consideraciones

- Modelos como Sonnet 4 y Opus 4 son potentes; aun así, **verifica siempre** salidas críticas (código, cambios sensibles).
- Controla el consumo de tokens y fragmenta tareas largas en subtareas más cortas para mantener rendimiento y control.

---

## Comandos esenciales y Hooks

### Slash commands list (útiles)

Incluye comandos que pueden aparecer en distintas implementaciones del cliente Claude Code. Adapta según la versión que uses:

- `/clear` — Reinicia memoria de la sesión.  
- `/compact` — Compacta historial.  
- `/statusline` — Configura línea de estado.  
- `/model` — Cambiar modelo.  
- `/init` — Inicializa `claude.md`.  
- `/help` — Muestra ayuda contextual (si está disponible).

### Hooks y trucos rápidos

Los hooks permiten modificar comportamiento de salida sin reescribir prompts grandes. Ejemplos:

- Hook simple para añadir flag `-d` al final de salidas build:  
  `append_hook: "-d --debug"`  
- Hook “think harder, brief” (pseudocódigo):  
  ```
  hook "think-short" {
    prompt_prepend: "Think harder. Answer in short. Keep it simple."
    apply_on: ["generate", "review"]
  }
  ```
- Usa hooks para forzar tono, límite de tokens, o incluir checklist mínimas.

---

## MCPS — Multi‑Context Processing Systems (Grupo: MCPs)

### ¿Qué son los MCPs?

Un MCP es un enfoque/arquitectura para gestionar múltiples contextos y agentes que colaboran en una tarea compleja. En la práctica permite:

- mantener diferentes contextos (usuario, proyecto, feature) simultáneamente  
- orquestar agentes con roles y sub‑tareas  
- integrar memoria, comandos y hooks en un flujo coherente

### ¿Para qué sirven?

- Orquestación de pipelines complejos (por ejemplo, de diseño → código → test → despliegue).  
- Mantener coherencia en proyectos de largo plazo donde el contexto cambia.  
- Mejorar trazabilidad y reproducibilidad de decisiones hechas por agentes.

### Componentes habituales de un MCP

- **Context managers**: archivos `claude.md`, metadatos por carpeta, variables.  
- **Agents**: instancias especializadas que reciben tareas concretas.  
- **Memory**: persistencia de datos útiles (preferencias, estado del proyecto).  
- **Commands / Hooks**: para reusar y estandarizar acciones frecuentes.  
- **Plugins**: UI, Playwright, herramientas de testing, generadores de UI (Magic).  
- **Orquestador**: proceso que coordina qué agent hace qué y cuándo.

### Instalación/puesta en marcha (pasos)

1. Define el `claude.md` global y por proyecto.  
2. Crea carpeta de `agents/` con configuración de cada agent.  
3. Añade carpeta `commands/` para comandos personalizados.  
4. Configura un almacenamiento para la memoria (local o remota).  
5. Prueba flujos cortos: "Crear README", "Limpiar código", "Revisar tests".  
6. Escala con más agents y orquestación por archivos/cola de tareas.

### Módulos y proyectos relevantes (Context7, Sequential, Magic, Playwright)

- **Context7** – extracción y manejo de documentación oficial y granos de contexto.  
- **Sequential** – ayuda para dividir procesos en pasos encadenados.  
- **Magic** – generación de componentes UI modernos (útil para prototipos rápidos).  
- **Playwright‑MCP** – automatización de navegador para pruebas E2E y scraping guiado por agents.  
- **Claude Code Workflows** – colecciones de flujos y recetas para automatizar procesos (tests, deployment, generación).  

> Nota: Muchos de estos nombres pueden referirse a librerías o repositorios comunitarios; adapta según los paquetes que uses.

---

## Agents (Grupo: Agents)

### ¿Qué es un Agent?

Un *agent* es una instancia especializada del modelo con un objetivo claro y un set de instrucciones persistentes (su contexto). Pueden ejecutarse en sesiones separadas, tener memoria dedicada y comunicarse por archivos o mensajes.

### Diferencia entre Agent, Sub‑Agent y Task‑Agent

- **Agent (Role)**: definición estable, p. ej. "Arquitecto" — piensa en diseño y estrategia.  
- **Sub‑Agent (Task)**: instancia creada para completar una tarea concreta p. ej. "limpiar archivo X".  
- **Task‑Agent**: similar al sub‑agent pero efímero y orientado a pasos discretos.

> Regla práctica: usa sub‑agents para tareas, roles para responsabilidades.

### ¿Para qué sirven? (casos de uso)

- Revisar PRs automáticamente.  
- Generar componentes UI a partir de diseños.  
- Ejecutar pruebas E2E con Playwright y reportar fallos.  
- Buscar recursos en la web y resumirlos.  
- Convertir requisitos en tickets y estimaciones.

### Cómo crear y configurar Agents

1. Crea archivo de configuración: `agents/arquitecto.md` con su prompt base.  
2. Define su memoria y permisos (lectura/escritura en carpetas).  
3. Añade triggers o slash commands para invocarlos (por ejemplo `/agents run arquitecto --goal "..."`).  
4. Define outputs esperados: archivos, issues, PRs, o mensajes en consola.  
5. Testea con tareas pequeñas y ajusta el prompt para reducir ambigüedad.

#### Ejemplo de archivo de agent (plantilla)

```md
# agents/constructor.md
name: constructor
role: "Genera código inicial de features"
instructions:
  - "Prioriza tests"
  - "Mantén código legible y documentado"
memory: project.constructor.memory.json
permissions:
  - read: repo/src
  - write: repo/src
triggers:
  - "/agents run constructor --task"
```

### Ejemplo práctico básico — Flujo de 4 agents

1. **Arquitecto**: define estructura y tasks. Produce lista de tickets.  
2. **Constructor**: genera código para el ticket.  
3. **Validador**: ejecuta tests y linters, reporta fallos.  
4. **Scribe**: actualiza la documentación y CHANGELOG.

Comunicación práctica: cada agent escribe en `tmp/agent-results/<agent>-<task>.json` y el orquestador lee/escribe esos archivos.

---

## Comandos personalizados (Custom Commands)

### Estructura de carpeta `commands`

```
claude/
  commands/
    generate-component.md
    cleanup-code/
      remove-dead.md
      format-md.md
```

### Sintaxis de ejemplo y parámetros

`commands/generate-component.md`:

```md
# generate-component
args:
  - name: component_name
  - name: framework
    default: react
template:
  - "Generate a reusable COMPONENT: $component_name for $framework."
```

Llamada de ejemplo (en cliente):  
`/command run generate-component --component_name Button --framework react`

### Buenas prácticas para commands reutilizables

- Documenta los argumentos y defaults.  
- Devuelve estructura predecible (carpeta, tests, storybook).  
- Versiona los commands y usa semver si son críticos.  
- Permite dry-run para validar salida sin escribir.

---

## Memoria (Memory Commands)

### Qué guardar en memoria y qué evitar

**Guardar:**
- Preferencias del proyecto (estilo de code, testing setup).  
- Reglas de despliegue, checklist de seguridad.  
- Alias, atajos, y convenciones.

**Evitar:**
- Datos sensibles (tokens, credenciales).  
- Información personal identificable salvo que sea estrictamente necesario.  
- Información corta-vida que podría quedar obsoleta.

### Formas de almacenar memoria (proyecto vs. usuario)

- Memoria por proyecto: `project.memory.json` dentro del repo.  
- Memoria por usuario: `~/.claude/user.memory.json` (privado).  
- Opcional: una API remota para memórias cuando trabajas con equipos.

Ejemplo de uso (en `claude.md`):

```md
memory:
  project: .claude/project.memory.json
  user: ~/.claude/user.memory.json
```

---

## SuperClaude y proyectos complementarios

### SuperClaude Framework

- Repo: `https://github.com/SuperClaude-Org/SuperClaude_Framework`  
- Propósito: extender flujos de Claude/agents con plantillas y orquestadores.

### Repositorios útiles (rápido)

- Playwright‑MCP: `https://github.com/microsoft/playwright-mcp` (automatización guiada por agents)  
- Claude Code Workflows: `https://github.com/OneRedOak/claude-code-workflows/tree/main`  
- Anthropic Docs: `https://docs.anthropic.com/en/home`

> Nota: actualiza urls y repositorios según versiones y forks que uses.

---

## Plugins y empaquetado del setup

- Empaqueta configuración (agents, commands, hooks, memoria) en un plugin/paquete para desplegar en nuevos proyectos.  
- Estructura sugerida para empaquetado:

```
my-claude-plugin/
  README.md
  agents/
  commands/
  recipes/
  install.sh
```

- `install.sh` debería crear `claude.md` base, copiar comandos y registrar hooks.

---

## Flujo sugerido: De básico a avanzado (orden pedagógico)

1. **Instalación básica de Claude & `claude.md`**  
2. **Comandos básicos y shortcuts**  
3. **Crear 1** agent simple (limpieza de código) y ejecutar una tarea.  
4. **Agregar un comando personalizado** y utilizarlo en el flujo.  
5. **Introducir memoria** para guardar convenciones.  
6. **Escalar a 3–4 agents** con roles claros y comunicación por archivos.  
7. **Agregar Playwright y Magic** para UI y pruebas automatizadas.  
8. **Empaquetar** como plugin y documentar el proceso.

---

## Checklist de buenas prácticas y errores comunes

- [ ] Mantén `claude.md` pequeño y directo.  
- [ ] Usa sub‑contextos por feature (no todo en un solo archivo).  
- [ ] Versiona los commands y agents.  
- [ ] No almacenes credenciales en memoria persistente.  
- [ ] Fragmenta tareas largas y revisa salidas intermedias.  
- [ ] Automatiza tests y linters en el flujo de validación.  
- [ ] Prefiere outputs estructurados (JSON) para comunicación entre agents.  
- [ ] Evita prompts ambiguos; especifica input/output esperado.

---

## Ejemplos de `claude.md`, commands y agents (Plantillas)

### `claude.md` (ejemplo mínimo)

```md
# claude.md
project: "DemoProject"
description: "Contexto principal del proyecto"
agents:
  - arquitecto
  - constructor
memory:
  project: .claude/project.memory.json
hooks:
  - name: think-short
    prompt_prepend: "Think harder. Answer in short. Keep it simple."
```

### `commands/generate-readme.md` (ejemplo)

```md
# generate-readme
args:
  - name: project_name
template:
  - "Generate a clean README for $project_name with sections: install, usage, contrib, license."
output:
  - path: docs/README.md
```

### `agents/validador.md` (ejemplo)

```md
# validador
name: validador
role: "Ejecuta tests, linters y summariza fallos"
instructions:
  - "Run unit tests: `npm test`"
  - "Run linter: `npm run lint`"
outputs:
  - reports/test-report.json
  - reports/lint-report.txt
```

---

## Apéndice: Lista rápida de slash commands y atajos

- `/clear` — limpia contexto.  
- `/compact` — resume historial.  
- `/statusline` — configura estado.  
- `/model` — cambia modelo.  
- `/init` — inicializa `claude.md`.  
- `shift+tab` — cambia modos en el editor (si aplica).  
- `claude dangerously-skip-permissions` — modo avanzado (usar con cautela).

---

## Referencias y notas finales

- Anthropic Docs (instalación y autenticación)  
- Anthropic engineering (best practices para agentic coding)  
- Repositorios comunitarios: SuperClaude, Playwright‑MCP, Claude Code Workflows

---

### Licencia y uso

Este documento es un template y guía. Adáptalo a tu flujo, organiza tokens y permisos con cuidado, y valida siempre cambios críticos generados por agentes.

---

**Fin de la documentación.**
