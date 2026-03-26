# Привязка GitHub аккаунта к терминалу

Ниже безопасный и рабочий способ для Windows + Cursor terminal.

## 1) Проверить git и gh

```powershell
git --version
gh --version
```

Если `gh` не найден, установите GitHub CLI:  
[https://cli.github.com/](https://cli.github.com/)

## 2) Логин в GitHub CLI

```powershell
gh auth login
```

Рекомендуемые ответы:
- `GitHub.com`
- `HTTPS`
- `Login with a web browser`

Проверка:

```powershell
gh auth status
```

## 3) Настроить имя/почту для коммитов

> Важно: эти значения должны совпадать с вашим GitHub-профилем.

```powershell
git config --global user.name "YOUR_NAME"
git config --global user.email "YOUR_EMAIL"
```

Проверка:

```powershell
git config --global --get user.name
git config --global --get user.email
```

## 4) Проверить доступ к репозиторию

```powershell
gh repo view YOUR_USERNAME/GenNiga
```

Если открывается — терминал привязан к аккаунту.

## 5) Первый push

```powershell
git init
git add .
git commit -m "Initial production-ready card generator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/GenNiga.git
git push -u origin main
```

---

## Частые проблемы

- `403` при push: вы залогинены не тем аккаунтом -> `gh auth logout`, затем `gh auth login`.
- Коммиты идут от другого email -> исправьте `git config --global user.email`.
- Двухфакторка мешает HTTPS push -> используйте `gh auth login` (он сам настроит credential helper).

