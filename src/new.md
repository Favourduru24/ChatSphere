
Wahab ZafarWahab Zafar

 
C:\Users\HP\Transiflow\transiflow\backend>git branch
* main

C:\Users\HP\Transiflow\transiflow\backend>git fetch origin
remote: Enumerating objects: 27, done.
remote: Counting objects: 100% (27/27), done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 14 (delta 8), reused 14 (delta 8), pack-reused 0 (from 0)
Unpacking objects: 100% (14/14), 2.69 KiB | 15.00 KiB/s, done.
From https://github.com/CogOperations/transiflow
   09462bf..067d236  dev        -> origin/dev
   eedff6d..2fce6dd  feature/onboarding-mobile -> origin/feature/onboarding-mobile

C:\Users\HP\Transiflow\transiflow\backend>git checkout dev
branch 'dev' set up to track 'origin/dev'.
Switched to a new branch 'dev'

C:\Users\HP\Transiflow\transiflow\backend>git branch
* dev
  main

C:\Users\HP\Transiflow\transiflow\backend>git status
On branch dev
Your branch is up to date with 'origin/dev'.

nothing to commit, working tree clean

C:\Users\HP\Transiflow\transiflow\backend>git pull
Already up to date.

C:\Users\HP\Transiflow\transiflow\backend>git branch
* dev
  main

C:\Users\HP\Transiflow\transiflow\backend>git checkout -b backend/app-bootstrap
Switched to a new branch 'backend/app-bootstrap'

C:\Users\HP\Transiflow\transiflow\backend>git branch
* backend/app-bootstrap
  dev
  main

C:\Users\HP\Transiflow\transiflow\backend>git log --oneline --decorate --graph --all
* 2fce6dd (origin/feature/onboarding-mobile) fix: upgraded from AsyncStorage to react-native-keychain for storing sensitive data (tokens).
* eedff6d fix: optimized imports with index.ts files
* 1fc7aad fix: fixed status bar bugs, improved keyboard navigation when dealing with inputs, optimized code for performance
* 3f17729 feat: add build
* ee4b190 fix: update gitignore
| *   067d236 (HEAD -> backend/app-bootstrap, origin/main, origin/dev, origin/HEAD, main, dev) Merge pull request #4 from CogOperations/backend/app-bootstrap
| |\
| | * f2ff877 (origin/backend/app-bootstrap) feat: bootstrap express app with middleware and health check
| * | d36dc02 Merge pull request #3 from CogOperations/backend/project-setup
|/| |
| |/
| * ffb9666 (origin/backend/project-setup) chore: setup backend dev dependencies and nodemon
|/
* 09462bf Initial structure
* e1ba3ab Initial commit

C:\Users\HP\Transiflow\transiflow\backend>git status
On branch backend/app-bootstrap
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   src/controllers/passenger.controller.ts

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        src/services/

no changes added to commit (use "git add" and/or "git commit -a")

C:\Users\HP\Transiflow\transiflow\backend>git branch
* backend/app-bootstrap
  dev
  main

C:\Users\HP\Transiflow\transiflow\backend>git add .

C:\Users\HP\Transiflow\transiflow\backend>git commit -m "Bootstrap backend app"
[backend/app-bootstrap c24808a] Bootstrap backend app
 3 files changed, 14 insertions(+)
 create mode 100644 backend/src/services/auth.service.ts
 create mode 100644 backend/src/services/passenger.service.ts

C:\Users\HP\Transiflow\transiflow\backend>git push -u origin backend/app-bootstrap
Enumerating objects: 13, done.
Counting objects: 100% (13/13), done.
Delta compression using up to 4 threads
Compressing objects: 100% (7/7), done.
Writing objects: 100% (8/8), 750 bytes | 125.00 KiB/s, done.
Total 8 (delta 4), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (4/4), completed with 4 local objects.
To https://github.com/CogOperations/transiflow.git
   f2ff877..c24808a  backend/app-bootstrap -> backend/app-bootstrap
branch 'backend/app-bootstrap' set up to track 'origin/backend/app-bootstrap'.

C:\Users\HP\Transiflow\transiflow\backend>git fetch origin
remote: Enumerating objects: 1, done.
remote: Counting objects: 100% (1/1), done.
remote: Total 1 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
Unpacking objects: 100% (1/1), 922 bytes | 92.00 KiB/s, done.
From https://github.com/CogOperations/transiflow
   067d236..63399c2  dev        -> origin/dev

C:\Users\HP\Transiflow\transiflow\backend>git branch
* backend/app-bootstrap
  dev
  main

C:\Users\HP\Transiflow\transiflow\backend>git checkout dev
Switched to branch 'dev'
Your branch is behind 'origin/dev' by 2 commits, and can be fast-forwarded.
  (use "git pull" to update your local branch)

C:\Users\HP\Transiflow\transiflow\backend>git pull origin dev
From https://github.com/CogOperations/transiflow
 * branch            dev        -> FETCH_HEAD
Updating 067d236..63399c2
Fast-forward
 backend/src/controllers/passenger.controller.ts |  1 +
 backend/src/services/auth.service.ts            | 12 ++++++++++++
 backend/src/services/passenger.service.ts       |  1 +
 3 files changed, 14 insertions(+)
 create mode 100644 backend/src/services/auth.service.ts
 create mode 100644 backend/src/services/passenger.service.ts

C:\Users\HP\Transiflow\transiflow\backend>npm install

added 151 packages, and audited 152 packages in 39s

29 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

C:\Users\HP\Transiflow\transiflow\backend>