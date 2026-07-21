<#
.SYNOPSIS
  Initializes git for the Event Management Platform project, creates one commit
  per feature area (mirroring how the project was built), and pushes to GitHub.

.PARAMETER RemoteUrl
  Your GitHub repo URL. Defaults to https://github.com/Sepidehnasiri/Angular-managment.git
  Make sure that repo exists (create it empty, no README, at https://github.com/new) before running.

.EXAMPLE
  .\scripts\setup-git.ps1
  .\scripts\setup-git.ps1 -RemoteUrl "https://github.com/Sepidehnasiri/some-other-repo.git"
#>

param(
    [string]$RemoteUrl = "https://github.com/Sepidehnasiri/Angular-managment.git"
)

$ErrorActionPreference = "Stop"

# Run from the repo root regardless of where the script is invoked from
Set-Location (Join-Path $PSScriptRoot "..")

if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

function Commit-Step {
    param([string[]]$Paths, [string]$Message)
    git add $Paths
    $staged = git diff --cached --name-only
    if ($staged) {
        git commit -m $Message
    } else {
        Write-Host "Skipping '$Message' (nothing to commit)"
    }
}

Commit-Step -Paths @(
    "package.json", "angular.json", "tsconfig.json", "tsconfig.app.json",
    "tsconfig.spec.json", ".gitignore", "src/index.html", "src/main.ts", "src/styles.scss"
) -Message "chore: scaffold Angular project config"

Commit-Step -Paths @("src/app/core") -Message "feat: core models and services (events, bookings, theme, favorites, mock user)"

Commit-Step -Paths @(
    "src/app/app.config.ts", "src/app/app.routes.ts", "src/app/app.component.ts",
    "src/app/app.component.html", "src/app/app.component.scss", "src/app/shared"
) -Message "feat: app shell, routing, header nav, and theme toggle"

Commit-Step -Paths @("src/app/features/events/events-list") -Message "feat: events listing with search, filters, sort, and favorites"

Commit-Step -Paths @("src/app/features/events/event-details") -Message "feat: event details page"

Commit-Step -Paths @("src/app/features/booking") -Message "feat: 3-step ticket booking flow with validation and confirmation"

Commit-Step -Paths @("src/app/features/my-bookings") -Message "feat: my bookings page with cancellation flow"

Commit-Step -Paths @("db.json", "README.md", "scripts") -Message "chore: mock backend data and docs"

# Catch-all in case anything was missed
Commit-Step -Paths @(".") -Message "chore: remaining project files"

git remote remove origin 2>$null
git remote add origin $RemoteUrl
git push -u origin main

Write-Host "`nDone. Pushed to $RemoteUrl"
