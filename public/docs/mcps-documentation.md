
# Guia para Claude Code

## Introducción

Este documento está pensado como guía progresiva y práctica para que un lector —desde principiante hasta intermedio— pueda instalar, configurar y orquestar un ecosistema de Claude Code con MCPS y Agents. El orden está diseñado para enseñar primero los elementos imprescindibles (configuración y comandos), y luego profundizar en agentes, memoria, comandos personalizados y orquestación compleja.

**Repo del video:** [https://github.com/GonzaSab/auth-onboarding-app](https://github.com/GonzaSab/auth-onboarding-app)

---

## Configuración inicial de Claude

### Requisitos

- **Node.js 18 or newer**
- **A [Claude.ai](https://claude.ai)** (recommended) or **Claude Console** account

### Installation

```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Navigate to your project
cd your-awesome-project

# Start coding with Claude
claude
# You'll be prompted to log in on first use
```

**Official Documentation:** [https://docs.claude.com/en/docs/claude-code/overview](https://docs.claude.com/en/docs/claude-code/overview)


### CLAUDE.md file

CLAUDE.md es un archivo especial que Claude lee automáticamente para obtener contexto del proyecto. 

**Best practices:**

- **Keep it under 100 lines** - Claude necesita el espacio de contexto para tu código
- **Focus on project-specific patterns** - No instrucciones genéricas como "write clean code"
- **Update as you code** - Usa la tecla `#` para que Claude agregue instrucciones automáticamente


## Comandos básicos del entorno de Claude

- `/clear` — limpia la sesión.  
- `/compact` — resume historial para ahorrar tokens y mantener foco.  
- `/statusline` — muestra o configura la línea de estado.  
- `/model` — ver o cambiar el modelo activo (p. ej. `Sonnet 4`, `Opus 4`).  
- `/init` — inicializa `claude.md` o la estructura base del proyecto.
- `shift+tab` — alterna modos (plan, accept, common) en la UI (según cliente).  


### Modelos y consideraciones

- Modelos como Sonnet 4 y Opus 4 son potentes; aun así, **verifica siempre** salidas críticas (código, cambios sensibles).
- Controla el consumo de tokens y fragmenta tareas largas en subtareas más cortas para mantener rendimiento y control.

---


## MCPS — Multi‑Context Processing Systems

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

> Nota: Muchos de estos nombres pueden referirse a librerías o repositorios comunitarios; adapta según los paquetes que uses.

---

## Agents

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

### Repositorios útiles (rápido)

- Playwright‑MCP: `https://github.com/microsoft/playwright-mcp` (automatización guiada por agents)  
- Claude Code Workflows: `https://github.com/OneRedOak/claude-code-workflows/tree/main`  
- Anthropic Docs: `https://docs.anthropic.com/en/home`

> Nota: actualiza urls y repositorios según versiones y forks que uses.

---

## Referencias y notas finales

### Deploy en cloud
- **Railway Ref Code**: [https://railway.app?referralCode=ElklE4](https://railway.app?referralCode=ElklE4)

### Official Documentation
- **Claude Code Overview**: [https://docs.claude.com/en/docs/claude-code/overview](https://docs.claude.com/en/docs/claude-code/overview)
- **Getting Started**: [https://docs.claude.com/en/docs/claude-code/getting-started](https://docs.claude.com/en/docs/claude-code/getting-started)
- **Best Practices**: [https://www.anthropic.com/engineering/claude-code-best-practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- **Anthropic Documentation**: [https://docs.anthropic.com/en/home](https://docs.anthropic.com/en/home)

### Community Resources
- **SuperClaude Framework**: [https://github.com/SuperClaude-Org/SuperClaude_Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework)
- **Playwright-MCP**: [https://github.com/microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
- **Claude Code Workflows**: [https://github.com/OneRedOak/claude-code-workflows](https://github.com/OneRedOak/claude-code-workflows)

---

### Licencia y uso

Este documento es un template y guía. Adáptalo a tu flujo, organiza tokens y permisos con cuidado, y valida siempre cambios críticos generados por agentes.