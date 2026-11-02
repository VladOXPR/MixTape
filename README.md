# MixTape
---
## About
MixTape is a Django-powered collaborative platform designed for amateur artists and producers to create music together. It offers a workspace for sharing music, chatting, and distributing final tracks to major streaming services like Spotify and Apple Music.

## Usage
visit https://mixtape-675453697310.us-central1.run.app in your browser to view the website. Here's how you can use the platform:

- Create an Artist Profile: Sign up and create your artist profile, showcasing your musical skills, genres, and past works.
- Browse Other Artists: Look through the catalog of artists that need collaboration and find one that suits your style.
- Start a Project: Initiate a new project, add your friend as a collaborator, work on the music project, record vocals, and share audio samples.

## Deployment
Hosted on Google Cloud Run (project `mixtape-relaunch`, region `us-central1`) with Cloud SQL Postgres and a Cloud Storage bucket mounted as the media folder. To redeploy:

```bash
gcloud builds submit --project mixtape-relaunch --region us-central1 --tag us-central1-docker.pkg.dev/mixtape-relaunch/mixtape/web:TAG .
gcloud run deploy mixtape --project mixtape-relaunch --region us-central1 --image us-central1-docker.pkg.dev/mixtape-relaunch/mixtape/web:TAG
```

Run locally with `pip install -r requirements.txt && python manage.py runserver` (defaults to SQLite and debug mode).

## User Interface
![340522F6-D281-4339-B292-A63CAD4F43BF](https://github.com/VladOXPR/MixTape/assets/62916716/2e7b4377-5ca7-467b-9e58-ab1061f9454f)
![527DEAF0-DBF3-4A27-A070-F7150FEF1686](https://github.com/VladOXPR/MixTape/assets/62916716/8974bc81-759f-4dfe-bd52-210189cad575)
