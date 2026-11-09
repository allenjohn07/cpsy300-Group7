# Recipe Insights Dashboard — CPSY 300 Team Project

A Next.js dashboard that turns a real nutrition data set (`All_Diets.csv`, 7,806 recipes across five diets) into insights and charts. It runs in a container on **Azure Container Apps** and is redeployed automatically by a **GitHub Actions** pipeline on every merge to `main`.

**Live app:** <https://ca-recipes-group7.livelybush-72cb39ba.canadacentral.azurecontainerapps.io>
**JSON route:** <https://ca-recipes-group7.livelybush-72cb39ba.canadacentral.azurecontainerapps.io/api/insights>

## Team: Group 7 (`group7`)

| Member | Role |
| --- | --- |
| Allen John | GitHub owner and Azure host: repository, Azure resources, CI/CD pipeline |
| Khujesta | App and data: given app code, data checks, visible change, cleaning rules |
| Sean | Container and report: Dockerfile, README, report, submission |

## What the dashboard shows

1. Average protein, carbohydrates and fat (g) for each diet type
2. The five highest-protein recipes in each diet type
3. The five most common cuisine types in each diet type
4. Protein ÷ carbs and carbs ÷ fat ratios for each diet type
5. Data quality: rows read, removed and used

| Data quality | Value |
| --- | --- |
| Rows read | 7,806 |
| Removed: duplicates | 720 |
| Removed: extreme values (> 1,000 g) | 63 |
| Kept but flagged: 0 g protein or fat | 39 |
| Rows used | 7,023 |

## How it is deployed

```
laptop → GitHub (pull request, approved, merged to main)
       → GitHub Actions (build image, tag with commit ID)
       → Azure Container Registry
       → Azure Container Apps
       → browser
```

- The image is built from a two-stage `Dockerfile`, with the data file copied into the image.
- The dashboard heading comes from the `DASHBOARD_TITLE` environment variable set on the container app, not from the code.
- The pipeline signs in to Azure with OpenID Connect (no stored password) and tags every image with the commit ID (`${{ github.sha }}`).
- The container app scales to zero replicas when idle.

## Run it locally

Needs Node.js and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The heading shows "Recipe insights" unless `DASHBOARD_TITLE` is set.

### Run it in Docker

```bash
docker build --platform linux/amd64 -t recipes:local .
docker run -d --name recipes -p 8080:3000 -e DASHBOARD_TITLE="Local test" recipes:local
```

Open <http://localhost:8080>, then stop it with `docker stop recipes` and `docker rm recipes`.

## Project layout

| Path | What it is |
| --- | --- |
| `data/All_Diets.csv` | The recipe data set |
| `lib/data.ts` | Reads the CSV into rows |
| `lib/insights.ts` | The five cleaning rules and the five insights |
| `app/page.tsx` | The dashboard page (runs on the server) |
| `app/components/Charts.tsx` | The three charts (run in the browser) |
| `app/api/insights/route.ts` | The `/api/insights` JSON route |
| `Dockerfile`, `.dockerignore` | The container image |
| `.github/workflows/deploy.yml` | The build-and-deploy pipeline |

## How we work

`main` is protected: every change arrives through a pull request approved by a teammate.
