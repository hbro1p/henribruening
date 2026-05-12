# Plan: Reaktivierung, Passwort-Update & Portfolio-Überarbeitung

## 1. Website wieder veröffentlichen (öffentlich)
- Publish-Sichtbarkeit auf `public` setzen, damit `https://henri-bruening.lovable.app` wieder ohne Workspace-Login erreichbar ist.

## 2. Passwort reparieren
- Das Login-Passwort wird über das Supabase-Secret `MASTER_PASSWORD` geprüft (Edge Function `verify-password`, Section `global`).
- Secret `MASTER_PASSWORD` wird auf den neuen Wert aktualisiert: `!henri26_portfolio#`
- Anschließend kurzer Test der Edge Function via curl (sollte `valid: true` liefern), damit wir sicher sind, dass es wirklich funktioniert.

## 3. Portfolio überarbeiten (`src/pages/MyProjects.tsx`)

Fokus auf eigenständig geplante & umgesetzte Projekte. Bestehende Einträge werden neu sortiert; die drei neuen Projekte stehen oben. Reihenfolge:

1. **Coesfelder Flohmarkt** (NEU)
   - Beschreibung (DE/EN/ES): Kostenloser Nachbarschaftsflohmarkt in Coesfeld, gemeinsam mit Arne organisiert. Komplette Organisation, Verkäufer-Anmeldung, Kommunikation mit Teilnehmern, Zusammenarbeit mit der Stadt Coesfeld, Social Media, Flyer & öffentliche Bewerbung. Zeigt: eigene Ideen real umsetzen und sichtbar machen, Nachhaltigkeit & Community lokal stärken.
   - Links:
     - Instagram: https://www.instagram.com/coesfeld.flohmarkt/
     - YouTube (Aftermovie / Video): https://www.youtube.com/watch?v=OZNhzwlcP0M
     *(Hinweis: Du hast denselben YouTube-Link zweimal geschickt – einmal für Facharbeit-Interviews, einmal für die Flohmarkt-Website. Ich nehme ihn vorerst beim Flohmarkt auf. Falls er eigentlich nur zur Facharbeit gehört, sag Bescheid und ich entferne ihn hier.)*

2. **FALC Immobilien Coesfeld – Kelwin Lamparter (Social Media)** (NEU)
   - Beschreibung: Aufbau des Social-Media-Auftritts für Makler Kelwin Lamparter (FALC Immobilien Coesfeld). Entwicklung von Content-Ideen, Hooks, Skripten & Reels rund um Immobilien, Verkauf & Makleralltag. In ca. 2 Monaten ~1.400 neue Follower – Fokus: lokale Marke, Vertrauen & zielgruppengerechte Inhalte.
   - Link: Instagram-Profil von Kelwin (sofern vorhanden – siehe offene Frage unten)

3. **Facharbeit Englisch – „The Fading American Dream?"** (NEU)
   - Beschreibung: Facharbeit über Gentrifizierung, Wohnraum & Einwanderung in Brooklyn, NYC. Eigene Recherche inkl. selbstorganisierter Video-Interviews mit Locals (Reddit-Post >17.000 Aufrufe → 5 Interviews). Kombination aus persönlichen Perspektiven & Daten. Ergebnis: Klassischer American Dream (Eigenheim) für viele in Brooklyn unerreichbar – heute eher Zugehörigkeit, Freiheit, persönliche Erfüllung.
   - Links:
     - Facharbeit (PDF, Google Drive): https://drive.google.com/file/d/1i-K5SjLzHxTqLpM1ZwG8FGUhMXqZRKB1/view?usp=sharing
     - Interview-Video (YouTube): https://www.youtube.com/watch?v=OZNhzwlcP0M

4. **Internly** (bleibt)
5. **Florian Klostermann – Social Media** (bleibt, inkl. bestehender Video-Galerie)
6. **Kebab Bros – Social Media** (bleibt)
7. **Website Design – Real Estate & Coaching** (bleibt)

Design (Window-/Theme-Styles, Karten-Layout, Sprachumschaltung DE/EN/ES) bleibt unverändert – nur Inhalte werden ergänzt/umsortiert.

## Offene Frage
- Für das FALC-/Kelwin-Lamparter-Projekt: Soll ich Kelwins Instagram-Profil verlinken? Falls ja, bitte den Instagram-Handle/URL schicken. Sonst lasse ich den Eintrag ohne Link bzw. verlinke nur `https://www.falcimmobilien.de/coesfeld/` (oder eine andere von dir gewünschte Seite).

## Technische Details
- Nur Frontend-Änderungen in `src/pages/MyProjects.tsx` (Projekt-Array erweitern/umsortieren).
- Secret-Update via `secrets--update_secret` für `MASTER_PASSWORD`.
- Publish-Visibility-Update via `publish_settings--update_visibility` (`public`).
- Verifikation: curl-Test gegen `verify-password` mit dem neuen Passwort.
