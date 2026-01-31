# 🚀 LearnProg 3D - Documentation Principale

**LearnProg 3D** est une plateforme web éducative interactive qui enseigne la programmation et l'algorithmique à travers un jeu vidéo 3D immersif. Dirigez un singe dans 45 niveaux captivants répartis sur 5 biomes uniques en utilisant un langage de programmation visuel par blocs.

---

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Technologies utilisées](#technologies-utilisées)
- [Démarrage rapide](#démarrage-rapide)
- [Documentation détaillée](#documentation-détaillée)
- [Support et contribution](#support-et-contribution)

---

## 🎯 Vue d'ensemble

### Concept du jeu

LearnProg 3D transforme l'apprentissage de la programmation en une aventure ludique. Les joueurs :

- **Programment** un personnage 3D avec des blocs drag & drop
- **Résolvent** des énigmes algorithmiques de difficulté croissante
- **Explorent** 5 biomes distincts (Jungle, Désert, Glace, Cité Digitale, Espace)
- **Collectent** des étoiles en optimisant leur code
- **Sauvegardent** leur progression sur le cloud

### Public cible

- **Débutants** : Aucune connaissance en programmation requise
- **Étudiants** : Renforcement des concepts algorithmiques
- **Enseignants** : Outil pédagogique interactif
- **Curieux** : Découverte ludique de la logique informatique

---

## 🛠️ Technologies utilisées

### Frontend
- **Three.js** : Moteur 3D pour la scène et les animations
- **Vite** : Build tool ultra-rapide et hot reload
- **Vanilla JavaScript** : Code moderne ES6+ sans framework lourd
- **CSS3** : Design moderne avec animations fluides

### Backend & Services Cloud
- **Convex** : Base de données temps réel et fonctions serverless
- **Clerk** : Authentification sécurisée et gestion des utilisateurs

### Concepts de programmation enseignés
- Séquences d'instructions
- Boucles (`REPEAT`, `WHILE`)
- Conditions (`IF`, capteurs)
- Fonctions personnalisées
- Variables et compteurs
- Débogage et optimisation

---

## ⚡ Démarrage rapide

### Prérequis

- **Node.js** 18+ et **npm**
- Un compte [Clerk](https://clerk.dev) (gratuit)
- Un compte [Convex](https://convex.dev) (gratuit)

### Installation en 3 étapes

```bash
# 1. Cloner le projet
git clone <votre-repo>
cd test_jeu_3d

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Le jeu sera accessible sur `http://localhost:5173`

> 📖 Pour une installation détaillée avec configuration cloud : [INSTALL.md](./INSTALL.md)

---

## 📚 Documentation détaillée

| Fichier | Description |
|---------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Structure du projet, organisation du code |
| [INSTALL.md](./INSTALL.md) | Guide d'installation complet (dev + prod) |
| [FEATURES.md](./FEATURES.md) | Liste complète des fonctionnalités |
| [API.md](./API.md) | Documentation des fonctions Convex |
| [ENV.md](./ENV.md) | Variables d'environnement requises |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Guide de déploiement (Vercel, Netlify, etc.) |
| [TESTS.md](./TESTS.md) | Stratégies de tests et validation |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Problèmes courants et solutions |
| [SECURITY.md](./SECURITY.md) | Bonnes pratiques de sécurité |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guide de contribution au projet |
| [CHANGELOG.md](./CHANGELOG.md) | Historique des versions |
| [ROADMAP.md](./ROADMAP.md) | Feuille de route des futures fonctionnalités |
| [DOCKER.md](./DOCKER.md) | Conteneurisation et orchestration |

---

## 🎮 Fonctionnalités principales

### 🧠 Apprentissage progressif
- **45 niveaux** conçus pédagogiquement
- Introduction graduelle des concepts
- Système de notation par étoiles (optimisation du code)

### 🌍 Biomes variés
- **Jungle Mystique** : Niveaux d'introduction
- **Désert Brûlant** : Mécaniques de poussée et obstacles
- **Glace Éternelle** : Téléporteurs et plateformes mobiles
- **Cité Digitale** : Capteurs et logique avancée
- **Vide Cosmique** : Défis ultimes combinant tous les concepts

### 💎 Mécaniques de jeu
- Collecte de bananes
- Esquive d'obstacles animés (crocodiles, serpents)
- Activation d'interrupteurs et portes
- Téléportation entre portails
- Blocs poussables pour créer des chemins
- Saut à 2 cases pour franchir des obstacles

### 🔐 Système Cloud
- **Authentification** via Clerk (email, Google, etc.)
- **Sauvegarde automatique** de la progression
- **Synchronisation** multi-appareils
- **Récupération de progression** après déconnexion

---

## 🤝 Support et contribution

### Obtenir de l'aide

- **Documentation** : Consultez les fichiers dans `/doc`
- **Issues** : Ouvrez une issue GitHub pour signaler un bug
- **Discussions** : Posez vos questions dans les Discussions

### Contribuer

Nous accueillons toutes les contributions ! Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour :
- Proposer de nouvelles fonctionnalités
- Créer de nouveaux niveaux
- Améliorer la documentation
- Corriger des bugs

---

## 📄 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer.

---

## 🙏 Remerciements

- **Three.js** pour le moteur 3D
- **Convex** pour l'infrastructure backend
- **Clerk** pour l'authentification sécurisée
- La communauté open-source pour l'inspiration

---

**Créé avec ❤️ pour rendre la programmation accessible à tous** 🐒💎✨
