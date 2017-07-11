# Concept: Commit conventions

Commit conventions allow your team to add more semantic meaning to your git history. This e.g. includes `type`, `scope` or `breaking changes`. 

With this additional information tools can derive useful human-readable information for releases of your project. Some examples are

* Automated, rich changelogs
* Aumomatic version bumps
* Filter fo test harnesses to run

The most common commit conventions follow this pattern:

```
type(scope?): subject
body?
footer?
```