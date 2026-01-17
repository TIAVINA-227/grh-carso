# RAPPORT DE STAGE

## Développement d'une Application Web de Gestion des Ressources Humaines (GRH-CARSO)

---

**Niveau :** L2 - Licence 2  
**École :** ENI (École Nationale d'Informatique)  
**Année académique :** 2024-2025  
**Type de stage :** Stage de développement d'application web  
**Durée :** Stage de développement  

---

**Auteur :** [Votre nom]  
**Tuteur pédagogique :** [Nom du tuteur]  
**Maître de stage :** [Nom du maître de stage]  

---

**Date de soutenance :** [Date]  

---

## Table des Matières

1. [Remerciements](#remerciements)
2. [Introduction](#introduction)
3. [Présentation du Projet](#présentation-du-projet)
4. [Analyse et Conception](#analyse-et-conception)
5. [Développement](#développement)
6. [Tests et Validation](#tests-et-validation)
7. [Conclusion et Perspectives](#conclusion-et-perspectives)
8. [Annexes](#annexes)
9. [Bibliographie](#bibliographie)

---

## Remerciements

Je tiens à exprimer ma sincère gratitude envers toutes les personnes qui ont contribué à la réalisation de ce stage et de ce rapport.

Mes remerciements vont tout d'abord à [Nom du maître de stage] pour m'avoir accueilli(e) et pour ses précieux conseils tout au long de cette période de stage.

Je remercie également [Nom du tuteur pédagogique] pour son accompagnement pédagogique et ses orientations qui ont enrichi mon travail.

Enfin, je remercie toute l'équipe de développement avec laquelle j'ai collaboré, ainsi que tous ceux qui ont contribué, de près ou de loin, à la réussite de ce projet.

---

## Introduction

### Contexte

Dans le cadre de ma formation en Licence 2 à l'École Nationale d'Informatique (ENI), j'ai réalisé un stage de développement qui m'a permis de concevoir et développer une application web complète de gestion des ressources humaines, nommée **GRH-CARSO**.

### Objectifs du Stage

Ce stage avait pour objectifs principaux :

- De mettre en pratique les connaissances acquises en développement web (frontend et backend)
- D'apprendre à concevoir et développer une application web complète et fonctionnelle
- De maîtriser les technologies modernes du développement web (React, Node.js, PostgreSQL)
- De comprendre les enjeux de la gestion des ressources humaines dans un contexte professionnel
- De développer des compétences en architecture logicielle et en gestion de base de données

### Structure du Rapport

Ce rapport présente de manière détaillée le projet réalisé. Il commence par une présentation générale du projet, suivie d'une analyse technique approfondie, puis du processus de développement, des tests réalisés, et se termine par une conclusion avec les perspectives d'évolution.

---

## Présentation du Projet

### 1.1 Description Générale

**GRH-CARSO** est une application web complète de gestion des ressources humaines développée pour faciliter la gestion administrative du personnel d'une entreprise. Cette application permet de gérer de manière centralisée et efficace tous les aspects liés aux ressources humaines.

### 1.2 Objectifs du Projet

L'objectif principal de ce projet était de créer un système intégré permettant de :

- **Gérer le personnel** : Enregistrement, suivi et gestion des informations des employés
- **Gérer les départements et postes** : Organisation structurelle de l'entreprise
- **Suivre les présences et absences** : Enregistrement et suivi de la présence des employés
- **Gérer les congés** : Demande, validation et suivi des congés des employés
- **Gérer les contrats** : Suivi des contrats de travail des employés
- **Gérer les paiements et bulletins** : Suivi des paiements et génération des bulletins de salaire
- **Suivre les performances** : Évaluation et suivi des performances des employés
- **Gérer les utilisateurs** : Système d'authentification et de gestion des rôles (SUPER_ADMIN, ADMIN, EMPLOYE)

### 1.3 Périmètre Fonctionnel

Le système couvre les fonctionnalités suivantes :

#### 1.3.1 Gestion des Employés

La gestion des employés est une fonctionnalité centrale du système GRH-CARSO. Elle permet aux administrateurs et super-administrateurs de gérer l'ensemble du personnel de l'entreprise.

**Objectif :** Centraliser toutes les informations relatives aux employés de l'entreprise et faciliter leur administration.

**Fonctionnalités principales :**

- **Création d'employé :** 
  - Saisie des informations personnelles (nom, prénom, date de naissance, adresse, email, téléphone)
  - Génération automatique d'un matricule unique si non fourni (format : EMP + timestamp)
  - Enregistrement de la date d'embauche
  - Association optionnelle à un département et un poste
  - Validation des données avant enregistrement

- **Consultation des employés :**
  - Affichage de la liste complète des employés avec leurs informations principales
  - Filtrage par département pour faciliter la recherche
  - Recherche par nom, prénom, matricule ou email
  - Affichage des statistiques : nombre total d'employés, employés actifs, départements
  - Visualisation des détails complets d'un employé (profil, contrat, historique)

- **Modification d'employé :**
  - Mise à jour de toutes les informations d'un employé
  - Modification de l'affectation départementale ou du poste
  - Mise à jour des informations de contact

- **Suppression d'employé :**
  - Suppression logique (soft delete) pour préserver l'historique
  - Vérification des dépendances avant suppression (contrats, présences, etc.)
  - Gestion des erreurs en cas de suppression impossible

- **Export des données :**
  - Génération de documents PDF contenant la liste des employés
  - Inclusion du logo de l'entreprise
  - Export personnalisable avec filtres

**Permissions :** 
- Consultation : SUPER_ADMIN, ADMIN, EMPLOYE (uniquement son propre profil)
- Création/Modification : SUPER_ADMIN, ADMIN
- Suppression : SUPER_ADMIN uniquement

#### 1.3.2 Gestion des Départements et Postes

Cette fonctionnalité permet d'organiser la structure hiérarchique de l'entreprise.

**Objectif :** Définir et gérer l'organisation structurelle de l'entreprise (départements) et les différents postes de travail.

**Gestion des Départements :**

- **Création et modification :**
  - Enregistrement du nom du département (unique)
  - Désignation d'un responsable
  - Visualisation du nombre d'employés par département
  - Calcul automatique du pourcentage de capacité du département

- **Consultation :**
  - Liste de tous les départements avec leurs statistiques
  - Affichage du nombre total d'employés par département
  - Identification des départements avec leurs responsables

- **Gestion :**
  - Modification des informations d'un département
  - Suppression (avec vérification des employés affectés)

**Gestion des Postes :**

- **Création et modification :**
  - Enregistrement de l'intitulé du poste
  - Description détaillée du poste (optionnelle)
  - Définition du niveau hiérarchique
  - Gestion des documents associés (descriptions de poste, fiches de poste)

- **Consultation :**
  - Liste de tous les postes avec leurs descriptions
  - Visualisation du nombre d'employés occupant chaque poste
  - Filtrage par niveau hiérarchique

- **Gestion :**
  - Modification des informations d'un poste
  - Upload et gestion de fichiers associés (descriptions, fiches de poste)
  - Suppression (avec vérification des affectations)

**Association Employés-Départements-Postes :**
- Un employé est associé à un département et un poste
- Ces associations peuvent être modifiées à tout moment
- L'historique des affectations peut être consulté

**Permissions :**
- Consultation : SUPER_ADMIN, ADMIN
- Création/Modification : SUPER_ADMIN, ADMIN
- Suppression : SUPER_ADMIN uniquement

#### 1.3.3 Gestion des Présences et Absences

Cette fonctionnalité permet de suivre l'assiduité du personnel et de gérer les absences.

**Objectif :** Enregistrer et suivre la présence des employés ainsi que leurs absences, pour une meilleure gestion du temps de travail.

**Gestion des Présences :**

- **Enregistrement des présences :**
  - Pointage quotidien avec date et statut (PRESENT, ABSENT, RETARD)
  - Enregistrement des heures travaillées (optionnel)
  - Justification en cas de retard
  - Possibilité pour les employés de pointer leur propre présence
  - Les administrateurs peuvent pointer la présence de n'importe quel employé

- **Suivi des présences :**
  - Consultation de l'historique des présences
  - Filtrage par date, employé, ou statut
  - Visualisation des statistiques (taux de présence, retards, absences)
  - Calcul automatique des heures travaillées totales

- **Notifications :**
  - Envoi automatique de notifications aux administrateurs lors de l'enregistrement d'une présence
  - Alertes pour les retards fréquents

**Gestion des Absences :**

- **Déclaration d'absence :**
  - Enregistrement des dates de début et fin d'absence
  - Sélection du type d'absence (maladie, personnelle, etc.)
  - Justification détaillée (optionnelle)
  - Pièce jointe pour justificatifs (optionnel)
  - Déclaration par l'employé lui-même ou par un administrateur

- **Consultation des absences :**
  - Liste de toutes les absences avec leurs détails
  - Filtrage par employé, type, ou période
  - Visualisation des justifications et pièces jointes
  - Statistiques sur les absences (fréquence, durée moyenne)

- **Notifications :**
  - Envoi automatique de notifications aux administrateurs lors d'une déclaration d'absence
  - Alertes pour les absences non justifiées

**Permissions :**
- Consultation : SUPER_ADMIN, ADMIN, EMPLOYE (ses propres présences/absences)
- Enregistrement : SUPER_ADMIN, ADMIN, EMPLOYE (pour soi-même)
- Modification/Suppression : SUPER_ADMIN, ADMIN uniquement

#### 1.3.4 Gestion des Congés

La gestion des congés est l'une des fonctionnalités les plus complexes du système, intégrant des règles métier avancées.

**Objectif :** Permettre aux employés de demander des congés, avec validation par les administrateurs, tout en respectant les règles légales et les limites de solde.

**Fonctionnalités principales :**

- **Demande de congé :**
  - Saisie du type de congé (Congé annuel, Congé maladie, RTT, Maternité, Paternité, Événement familial, Congé sans solde, etc.)
  - Sélection des dates de début et fin
  - Saisie du motif (optionnel)
  - Calcul automatique de la durée en jours calendaires
  - Validation automatique selon les règles métier :
    * Vérification du solde disponible
    * Respect des limites annuelles par type de congé
    * Vérification des chevauchements avec d'autres congés
    * Respect des règles spécifiques (congés uniques, jours consécutifs max, etc.)
  - Affichage du solde de congés restant avant validation

- **Calcul automatique des soldes :**
  - Calcul du solde annuel basé sur la date d'embauche
  - Report des jours non pris de l'année précédente (maximum 6 jours)
  - Déduction des congés déjà pris dans l'année
  - Gestion de différents types de congés avec leurs limites spécifiques

- **Validation/Rejet par les administrateurs :**
  - Consultation de toutes les demandes en attente (statut SOUMIS)
  - Détails complets de chaque demande (dates, durée, type, motif)
  - Approbation ou rejet avec motif (optionnel)
  - Historique de toutes les décisions

- **Suivi des congés :**
  - Liste de tous les congés avec leurs statuts (SOUMIS, APPROUVE, REJETE)
  - Filtrage par statut, type, employé, ou période
  - Visualisation du solde de congés de chaque employé
  - Statistiques (congés approuvés, en attente, rejetés)

- **Notifications en temps réel :**
  - Notification aux administrateurs lors d'une nouvelle demande de congé
  - Notification à l'employé lors de l'approbation ou du rejet de sa demande
  - Notifications via Socket.io pour une mise à jour instantanée

- **Export PDF :**
  - Génération de documents PDF pour les demandes de congés
  - Export de la liste des congés avec filtres

**Règles métier implémentées :**

- **Congé annuel :** Maximum 30 jours par an (proratisé selon date d'embauche), maximum 15 jours consécutifs
- **Congé maladie :** Maximum 30 jours par an
- **RTT :** Maximum 10 jours par an
- **Maternité/Paternité :** Congés uniques avec durée maximale spécifique
- **Événements familiaux :** Durées maximales selon le type d'événement
- **Report :** Maximum 6 jours de l'année précédente

**Permissions :**
- Consultation : SUPER_ADMIN, ADMIN (tous), EMPLOYE (ses propres congés)
- Demande : EMPLOYE uniquement
- Validation/Rejet : SUPER_ADMIN, ADMIN uniquement
- Suppression : SUPER_ADMIN, ADMIN uniquement

#### 1.3.5 Gestion des Contrats

Cette fonctionnalité permet de gérer les contrats de travail des employés.

**Objectif :** Suivre les contrats de travail de chaque employé avec leurs dates, types et salaires de base.

**Fonctionnalités principales :**

- **Enregistrement de contrat :**
  - Type de contrat (CDI, CDD, Stage, etc.)
  - Date de début (obligatoire)
  - Date de fin (pour CDD et contrats temporaires)
  - Salaire de base
  - Statut (ACTIF, TERMINE)
  - Association avec un employé (un contrat par employé)

- **Consultation :**
  - Liste de tous les contrats avec leurs statuts
  - Détails complets de chaque contrat
  - Filtrage par statut ou type de contrat
  - Visualisation des contrats actifs et terminés
  - Consultation par l'employé de son propre contrat

- **Gestion :**
  - Modification des informations d'un contrat
  - Clôture d'un contrat (passage en statut TERMINE)
  - Historique des contrats d'un employé

**Permissions :**
- Consultation : SUPER_ADMIN, ADMIN (tous), EMPLOYE (son propre contrat)
- Création/Modification : SUPER_ADMIN, ADMIN uniquement
- Suppression : SUPER_ADMIN uniquement

#### 1.3.6 Gestion des Paiements et Bulletins

Cette fonctionnalité permet de gérer les paiements des employés et de générer leurs bulletins de salaire.

**Objectif :** Enregistrer les paiements effectués aux employés et générer automatiquement les bulletins de salaire correspondants.

**Gestion des Paiements :**

- **Enregistrement de paiement :**
  - Date de paiement
  - Montant payé
  - Mode de paiement (virement, chèque, espèce, etc.)
  - Période concernée (dates de début et fin)
  - Statut (EFFECTUE, EN_ATTENTE, ANNULE)
  - Association avec un employé

- **Consultation :**
  - Liste de tous les paiements avec leurs détails
  - Filtrage par employé, période, ou statut
  - Statistiques (total payé, moyenne, nombre de paiements)
  - Paiements du mois en cours
  - Historique complet des paiements d'un employé

- **Gestion :**
  - Modification d'un paiement
  - Annulation d'un paiement (passage en statut ANNULE)
  - Suivi des paiements en attente

**Génération des Bulletins de Salaire :**

- **Création automatique :**
  - Génération automatique d'un bulletin de salaire lors de l'enregistrement d'un paiement
  - Enregistrement du mois et de l'année
  - Calcul du salaire brut et net
  - Statut du bulletin (valide, brouillon)

- **Consultation :**
  - Liste de tous les bulletins
  - Filtrage par statut (validés, brouillons)
  - Visualisation des détails (salaire brut, net, période)
  - Consultation par l'employé de ses propres bulletins

- **Export PDF :**
  - Génération de bulletins de salaire en PDF
  - Format professionnel avec logo de l'entreprise
  - Export de la liste des bulletins

**Permissions :**
- Consultation : SUPER_ADMIN, ADMIN (tous), EMPLOYE (ses propres bulletins)
- Création/Modification : SUPER_ADMIN, ADMIN uniquement
- Suppression : SUPER_ADMIN, ADMIN uniquement

#### 1.3.7 Suivi des Performances

Cette fonctionnalité permet d'évaluer et de suivre les performances des employés.

**Objectif :** Évaluer régulièrement les performances des employés et suivre leur évolution.

**Fonctionnalités principales :**

- **Évaluation de performance :**
  - Date d'évaluation
  - Note (sur une échelle définie)
  - Résultat de l'évaluation
  - Commentaires détaillés
  - Objectifs fixés
  - Réalisations constatées
  - Association avec un employé

- **Consultation :**
  - Liste de toutes les évaluations
  - Historique des évaluations d'un employé
  - Visualisation graphique de l'évolution des performances
  - Statistiques (moyenne, meilleure note, dernière évaluation)
  - Graphiques de tendance avec Recharts

- **Analyse :**
  - Comparaison des performances entre employés
  - Suivi de l'évolution dans le temps
  - Identification des points d'amélioration

**Permissions :**
- Consultation : SUPER_ADMIN, ADMIN (tous), EMPLOYE (ses propres évaluations)
- Création/Modification : SUPER_ADMIN, ADMIN uniquement
- Suppression : SUPER_ADMIN, ADMIN uniquement

#### 1.3.8 Système d'Authentification et Autorisation

Le système d'authentification et d'autorisation est la base de la sécurité de l'application.

**Objectif :** Sécuriser l'accès à l'application et gérer les permissions des utilisateurs selon leurs rôles.

**Authentification :**

- **Connexion :**
  - Authentification par email et mot de passe
  - Chiffrement des mots de passe avec bcrypt (salting automatique)
  - Génération de tokens JWT (JSON Web Tokens) valides 24 heures
  - Vérification du statut du compte (ACTIF/BLOQUE)
  - Gestion de la première connexion (obligation de changer le mot de passe)
  - Enregistrement de la dernière connexion

- **Gestion de la première connexion :**
  - Détection automatique lors de la première connexion
  - Affichage d'un modal obligatoire pour changer le mot de passe
  - Impossible d'accéder à l'application avant le changement
  - Génération de mots de passe temporaires (optionnel)

- **Réinitialisation de mot de passe :**
  - Demande de réinitialisation par email
  - Génération de token sécurisé avec expiration
  - Envoi d'email avec lien de réinitialisation
  - Réinitialisation via token unique

- **Sécurité des tokens :**
  - Tokens JWT signés avec secret privé
  - Expiration après 24 heures
  - Validation à chaque requête API
  - Middleware d'authentification pour protéger les routes

**Gestion des Rôles :**

Le système définit trois rôles principaux :

- **SUPER_ADMIN :** Accès complet à toutes les fonctionnalités
  * Gestion de tous les utilisateurs
  * Suppression de données
  * Configuration système
  
- **ADMIN :** Accès à la gestion opérationnelle
  * Gestion des employés (sauf suppression)
  * Validation des congés
  * Gestion des contrats, paiements, présences
  * Consultation des rapports
  
- **EMPLOYE :** Accès limité à ses propres données
  * Consultation de son profil
  * Demande de congés
  * Déclaration de présences/absences
  * Consultation de ses bulletins de salaire
  * Consultation de ses évaluations

**Système de Permissions Granulaires :**

- **Permissions par module :**
  - Chaque module (employés, congés, contrats, etc.) a ses propres permissions
  - Permissions séparées pour consultation, création, modification, suppression
  - Permissions spéciales (viewOwn, declare, pointer, etc.)

- **Protection des routes :**
  - Middleware de vérification des permissions
  - Vérification côté backend ET frontend
  - Composant ProtectedRoute pour les routes React
  - Masquage des éléments UI selon les permissions

- **Gestion des profils utilisateurs :**
  - Modification du profil (nom, prénom, email, téléphone, etc.)
  - Upload d'avatar (stockage sur Cloudinary)
  - Personnalisation de la photo de couverture
  - Gestion de la biographie
  - Modification du mot de passe depuis le profil

**Permissions :**
- Tous les utilisateurs peuvent se connecter et gérer leur propre profil
- Les permissions sont définies par rôle et module dans le fichier de configuration

#### 1.3.9 Système de Notifications

Le système de notifications permet une communication en temps réel entre le système et les utilisateurs.

**Objectif :** Informer les utilisateurs des événements importants de manière instantanée.

**Fonctionnalités principales :**

- **Notifications en temps réel :**
  - Utilisation de Socket.io pour la communication bidirectionnelle
  - Connexion WebSocket automatique après authentification
  - Mise à jour instantanée sans rechargement de page
  - Notifications visuelles avec compteur de notifications non lues

- **Types de notifications :**

  - **Demandes de congés :**
    * Notification aux administrateurs lorsqu'un employé demande un congé
    * Notification à l'employé lors de l'approbation/rejet de sa demande
    
  - **Absences et présences :**
    * Notification aux administrateurs lors d'une déclaration d'absence
    * Notification aux administrateurs lors d'une enregistrement de présence
    * Alertes pour les retards fréquents
    
  - **Autres événements :**
    * Notifications système
    * Alertes importantes
    * Informations générales

- **Centre de notifications :**
  - Liste de toutes les notifications de l'utilisateur
  - Filtrage par type et catégorie
  - Marquage comme lues/non lues
  - Suppression de notifications
  - Compteur de notifications non lues
  - Badge visuel avec nombre de notifications

- **Caractéristiques des notifications :**
  - Titre et message descriptif
  - Type (info, success, warning, error)
  - Catégorie (conge, absence, presence, etc.)
  - Date de création
  - Statut de lecture
  - Métadonnées (liens vers les entités concernées)
  - Stockage en base de données pour historique

- **Distribution automatique :**
  - Notifications ciblées par rôle (ex: tous les ADMIN et SUPER_ADMIN)
  - Notifications individuelles
  - Création automatique lors d'événements importants

**Permissions :**
- Tous les utilisateurs reçoivent des notifications selon leur rôle
- Consultation : Tous les utilisateurs (leurs propres notifications)

### 1.4 Contraintes Techniques

- **Architecture** : Application web full-stack (frontend + backend)
- **Base de données** : PostgreSQL
- **Sécurité** : Authentification JWT, chiffrement des mots de passe
- **Interface** : Responsive, compatible mobile et desktop
- **Performance** : Optimisation des requêtes et du rendu

---

## Analyse et Conception

### 2.1 Architecture Générale

L'application suit une architecture **client-serveur** avec séparation claire entre le frontend et le backend.

#### Architecture en Couches

```
┌─────────────────────────────────────┐
│         FRONTEND (React)            │
│  - Interface utilisateur            │
│  - Gestion de l'état                │
│  - Communication API                │
└──────────────┬──────────────────────┘
               │ HTTP/REST + Socket.io
┌──────────────▼──────────────────────┐
│      BACKEND (Node.js/Express)      │
│  - Routes API                       │
│  - Logique métier                   │
│  - Authentification                 │
│  - Gestion Socket.io                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      BASE DE DONNÉES (PostgreSQL)   │
│  - Modèles Prisma                   │
│  - Relations                        │
│  - Index                            │
└─────────────────────────────────────┘
```

### 2.2 Technologies Utilisées

#### Frontend

- **React 19.1.1** : Bibliothèque JavaScript pour la création d'interfaces utilisateur
- **Vite 7.1.7** : Outil de build moderne et rapide
- **TailwindCSS** : Framework CSS utilitaire pour le styling
- **Radix UI** : Bibliothèque de composants UI accessibles
- **React Router** : Gestion de la navigation
- **Socket.io-client** : Communication en temps réel
- **Recharts** : Bibliothèque pour la création de graphiques
- **React-PDF** : Génération de documents PDF
- **Zustand** : Gestion d'état légère

#### Backend

- **Node.js** : Environnement d'exécution JavaScript
- **Express 5.1.0** : Framework web pour Node.js
- **Prisma 6.16.2** : ORM (Object-Relational Mapping) moderne
- **PostgreSQL** : Base de données relationnelle
- **JWT (jsonwebtoken)** : Authentification par tokens
- **Bcrypt** : Chiffrement des mots de passe
- **Socket.io** : Communication en temps réel
- **Multer + Cloudinary** : Gestion des uploads d'images
- **Node-cron** : Tâches programmées (CRON jobs)
- **Nodemailer** : Envoi d'emails

### 2.3 Modèle de Données

Le modèle de données est conçu avec **Prisma ORM** et utilise PostgreSQL comme base de données.

#### Entités Principales

**Utilisateur**
- Informations d'authentification (email, mot de passe)
- Rôle (SUPER_ADMIN, ADMIN, EMPLOYE)
- Statut (ACTIF, BLOQUE)
- Profil utilisateur (avatar, bio, adresse, etc.)
- Relation avec Employe (1-1)
- Relations avec Conges et Notifications

**Employe**
- Informations personnelles (matricule, nom, prénom, date de naissance)
- Informations de contact (email, téléphone, adresse)
- Date d'embauche
- Relations avec Département et Poste
- Relations avec Contrat, Absences, Presences, Paiements, Conges, Performances

**Departement**
- Nom du département
- Responsable
- Relation avec Employes (1-N)

**Poste**
- Intitulé du poste
- Description
- Niveau hiérarchique
- Relation avec Employes (1-N)

**Contrat**
- Type de contrat
- Dates de début et fin
- Salaire de base
- Statut (ACTIF, TERMINE)
- Relation avec Employe (1-1)

**Presence**
- Date du jour
- Statut (PRESENT, ABSENT, RETARD)
- Heures travaillées
- Justification
- Relation avec Employe (N-1)

**Absence**
- Dates de début et fin
- Type d'absence
- Justification
- Pièce jointe
- Relation avec Employe (N-1)

**Conge**
- Type de congé
- Dates de début et fin
- Statut (SOUMIS, APPROUVE, REJETE)
- Motif
- Durée en jours
- Relations avec Utilisateur et Employe

**Paiement**
- Date de paiement
- Montant
- Mode de paiement
- Statut (EFFECTUE, EN_ATTENTE, ANNULE)
- Période (début et fin)
- Relation avec Employe (N-1)
- Relation avec BulletinSalaire (1-1)

**BulletinSalaire**
- Mois et année
- Salaire brut et net
- Statut
- Relation avec Paiement (1-1)

**SuiviPerformance**
- Date d'évaluation
- Note
- Résultat
- Commentaires
- Objectifs et réalisations
- Relation avec Employe (N-1)

**Notification**
- Titre et message
- Type et catégorie
- Statut de lecture
- Dates de création et de lecture
- Métadonnées (JSON)
- Relation avec Utilisateur (N-1)

### 2.4 Architecture Frontend

#### Structure des Composants

```
frontend/src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base
│   ├── login-form.jsx  # Formulaire de connexion
│   ├── app-sidebar.jsx # Barre latérale
│   └── ...
├── pages/              # Pages de l'application
│   ├── Dashboard.jsx
│   ├── Employes.jsx
│   ├── Departements.jsx
│   ├── Conges.jsx
│   └── ...
├── services/           # Services API
│   ├── employeService.js
│   ├── congeService.js
│   └── ...
├── hooks/              # Hooks React personnalisés
│   ├── useAuth.jsx
│   ├── useNotifications.js
│   └── ...
├── config/             # Configuration
│   └── permissions.js
└── exportPdf/          # Génération PDF
    └── ...
```

#### Système de Routage

L'application utilise **React Router** pour la navigation. Les routes sont protégées par un système de permissions basé sur les rôles utilisateurs.

#### Gestion d'État

- **Zustand** : Pour la gestion globale de l'état (authentification, notifications)
- **État local React** : Pour l'état spécifique à chaque composant

### 2.5 Architecture Backend

#### Structure du Backend

```
backend/
├── src/
│   ├── routes/         # Définition des routes API
│   │   ├── employeRoutes.js
│   │   ├── congeRoutes.js
│   │   └── ...
│   ├── controllers/    # Contrôleurs (logique métier)
│   │   ├── employeController.js
│   │   ├── congeController.js
│   │   └── ...
│   ├── services/       # Services métier
│   │   ├── employeService.js
│   │   ├── notificationService.js
│   │   └── ...
│   ├── jobs/           # Tâches CRON
│   │   └── congesCronJob.js
│   └── ...
├── prisma/
│   ├── schema.prisma   # Schéma de base de données
│   └── migrations/     # Migrations de base de données
└── index.js            # Point d'entrée
```

#### API REST

L'API suit les principes REST avec les routes suivantes :

- `POST /api/auth/login` : Authentification
- `GET /api/employes` : Liste des employés
- `POST /api/employes` : Création d'un employé
- `PUT /api/employes/:id` : Modification d'un employé
- `DELETE /api/employes/:id` : Suppression d'un employé
- Et ainsi de suite pour chaque ressource...

#### Authentification

- **JWT (JSON Web Tokens)** : Tokens d'authentification avec expiration
- **Middleware d'authentification** : Vérification des tokens sur les routes protégées
- **Middleware d'autorisation** : Vérification des permissions basées sur les rôles

#### Communication Temps Réel

- **Socket.io** : Pour les notifications en temps réel
- Les notifications sont envoyées automatiquement lors d'événements importants (validation de congés, nouvelles absences, etc.)

---

## Développement

### 3.1 Phase de Développement

Le développement s'est déroulé en plusieurs phases :

1. **Phase 1 : Conception et modélisation**
   - Définition du modèle de données
   - Création du schéma Prisma
   - Mise en place de la base de données

2. **Phase 2 : Développement Backend**
   - Configuration du serveur Express
   - Implémentation des routes API
   - Développement de la logique métier
   - Intégration de l'authentification JWT
   - Mise en place de Socket.io

3. **Phase 3 : Développement Frontend**
   - Configuration de React et Vite
   - Création des composants UI
   - Développement des pages principales
   - Intégration avec l'API backend
   - Mise en place du système de routage

4. **Phase 4 : Fonctionnalités Avancées**
   - Système de notifications en temps réel
   - Génération de PDF
   - Gestion des uploads d'images (Cloudinary)
   - Tâches CRON automatisées
   - Interface moderne avec design glassmorphic

5. **Phase 5 : Tests et Optimisations**
   - Tests fonctionnels
   - Corrections de bugs
   - Optimisations de performance
   - Amélioration de l'interface utilisateur

### 3.2 Développement Backend

#### Configuration de la Base de Données

Le schéma Prisma définit tous les modèles de données avec leurs relations. Les migrations permettent de gérer l'évolution de la base de données.

#### Routes API

Chaque ressource (employés, congés, départements, etc.) possède ses propres routes avec les opérations CRUD complètes.

Exemple de route pour les employés :
```javascript
router.post('/', createEmploye);
router.get('/', getAllEmployes);
router.get('/:id', getEmployeById);
router.put('/:id', updateEmploye);
router.delete('/:id', deleteEmploye);
```

#### Authentification et Autorisation

L'authentification utilise JWT avec des tokens expirant après 24 heures. Le middleware d'authentification vérifie le token sur chaque requête protégée.

#### Système de Notifications

Les notifications sont créées automatiquement lors d'événements importants et envoyées en temps réel via Socket.io aux utilisateurs concernés.

### 3.3 Développement Frontend

#### Design System

L'interface utilise un design moderne avec :
- **Glassmorphic Design** : Headers avec effet de verre dépoli
- **Gradients** : Utilisation de gradients colorés pour les cartes statistiques
- **Responsive Design** : Interface adaptative pour mobile et desktop
- **Dark Mode** : Support du mode sombre
- **Composants Radix UI** : Composants accessibles et personnalisables

#### Pages Principales

- **Dashboard** : Vue d'ensemble avec statistiques
- **Employés** : Gestion complète des employés
- **Départements** : Gestion des départements
- **Postes** : Gestion des postes
- **Contrats** : Suivi des contrats
- **Présences** : Enregistrement des présences
- **Absences** : Gestion des absences
- **Congés** : Gestion des demandes de congés
- **Paiements** : Gestion des paiements
- **Bulletins** : Génération des bulletins de salaire
- **Performances** : Suivi des performances
- **Utilisateurs** : Gestion des utilisateurs et rôles
- **Notifications** : Centre de notifications
- **Profil** : Gestion du profil utilisateur

#### Gestion d'État et Services

Les services API sont centralisés dans le dossier `services/` pour faciliter la communication avec le backend. L'état d'authentification est géré avec Zustand.

### 3.4 Fonctionnalités Avancées

#### Génération de PDF

L'application permet d'exporter les données en PDF (liste des employés, bulletins de salaire, etc.) en utilisant `react-pdf` et `jspdf`.

#### Upload d'Images

Les avatars des utilisateurs sont uploadés sur Cloudinary, un service de gestion d'images dans le cloud.

#### Tâches CRON

Des tâches automatisées (via node-cron) permettent d'effectuer des opérations périodiques, comme la gestion automatique des congés.

#### Notifications en Temps Réel

Le système de notifications utilise Socket.io pour envoyer des notifications en temps réel aux utilisateurs concernés.

---

## Tests et Validation

### 4.1 Tests Fonctionnels

Les principales fonctionnalités ont été testées :

#### Authentification
- ✅ Connexion avec identifiants valides
- ✅ Rejet des identifiants invalides
- ✅ Gestion des tokens JWT
- ✅ Protection des routes

#### Gestion des Employés
- ✅ Création d'un employé
- ✅ Modification d'un employé
- ✅ Suppression d'un employé
- ✅ Consultation de la liste
- ✅ Export PDF

#### Gestion des Congés
- ✅ Demande de congé par un employé
- ✅ Validation/rejet par un administrateur
- ✅ Notifications en temps réel
- ✅ Calcul automatique de la durée

#### Gestion des Présences
- ✅ Enregistrement des présences
- ✅ Gestion des retards
- ✅ Suivi des heures travaillées

#### Gestion des Paiements
- ✅ Enregistrement des paiements
- ✅ Génération des bulletins
- ✅ Export PDF

### 4.2 Tests d'Interface

L'interface a été testée sur différents navigateurs et tailles d'écran :
- ✅ Chrome, Firefox, Edge
- ✅ Mobile (responsive design)
- ✅ Tablette et desktop
- ✅ Mode sombre

### 4.3 Tests de Performance

Les performances ont été optimisées :
- ✅ Optimisation des requêtes base de données
- ✅ Lazy loading des composants
- ✅ Optimisation du rendu React
- ✅ Mise en cache des données statiques

### 4.4 Tests de Sécurité

Les aspects de sécurité ont été vérifiés :
- ✅ Chiffrement des mots de passe (bcrypt)
- ✅ Validation des tokens JWT
- ✅ Protection contre les injections SQL (Prisma)
- ✅ Gestion des permissions par rôle
- ✅ Validation des données d'entrée

---

## Conclusion et Perspectives

### 5.1 Bilan du Projet

Ce stage de développement a été une expérience très enrichissante qui m'a permis de :

- **Consolider mes compétences techniques** : Maîtrise approfondie de React, Node.js, PostgreSQL et des outils modernes de développement web
- **Apprendre l'architecture logicielle** : Compréhension de l'architecture en couches, de la séparation des responsabilités et des bonnes pratiques de développement
- **Développer un projet complet** : De la conception à la réalisation d'une application web complète et fonctionnelle
- **Travailler avec des outils professionnels** : Utilisation de Prisma, Socket.io, Cloudinary, et autres outils couramment utilisés dans l'industrie
- **Comprendre les enjeux métier** : Appréhension des besoins réels d'une application de gestion des ressources humaines

### 5.2 Difficultés Rencontrées

Plusieurs défis ont été rencontrés lors du développement :

- **Complexité du modèle de données** : Gestion des relations complexes entre les différentes entités
- **Synchronisation frontend-backend** : Assurer la cohérence des données entre le client et le serveur
- **Gestion des permissions** : Implémentation d'un système de permissions granulaires
- **Notifications en temps réel** : Configuration et utilisation de Socket.io
- **Optimisation des performances** : Gestion des requêtes et du rendu pour une meilleure expérience utilisateur

Ces difficultés ont été surmontées grâce à la documentation technique, aux ressources en ligne, et à une approche méthodique de résolution de problèmes.

### 5.3 Apprentissages

Ce projet m'a permis d'apprendre :

- Les bonnes pratiques de développement web moderne
- L'importance de la sécurité dans une application web
- La gestion de l'état dans une application React
- L'architecture REST et la conception d'API
- La modélisation de bases de données relationnelles
- Le travail avec des ORM modernes (Prisma)
- La communication en temps réel avec WebSockets
- Le design d'interfaces utilisateur modernes et responsives

### 5.4 Perspectives d'Évolution

Plusieurs améliorations pourraient être apportées au projet :

#### Fonctionnalités
- **Module de recrutement** : Gestion des candidatures et du processus de recrutement
- **Module de formation** : Planification et suivi des formations des employés
- **Module de paie avancé** : Calculs automatiques plus poussés, gestion des cotisations sociales
- **Module de reporting** : Génération de rapports personnalisés et tableaux de bord avancés
- **Application mobile** : Développement d'une application mobile native ou progressive (PWA)

#### Techniques
- **Tests automatisés** : Implémentation de tests unitaires et d'intégration
- **CI/CD** : Mise en place d'un pipeline de déploiement continu
- **Monitoring** : Intégration d'outils de monitoring et de logging
- **Optimisations** : Amélioration des performances et optimisation du code
- **Documentation API** : Documentation automatique avec Swagger/OpenAPI

#### Sécurité
- **Authentification à deux facteurs (2FA)** : Renforcement de la sécurité
- **Audit de sécurité** : Réalisation d'un audit complet
- **Chiffrement des données sensibles** : Chiffrement additionnel pour les données critiques

### 5.5 Conclusion

Ce projet de stage a été l'opportunité de mettre en pratique les connaissances acquises en cours et de développer une application web complète et professionnelle. L'expérience acquise dans le développement full-stack, l'architecture logicielle, et la gestion de projet est précieuse pour ma carrière future dans le domaine de l'informatique.

Le projet GRH-CARSO, bien qu'étant un projet académique, pourrait évoluer vers une solution professionnelle complète avec les améliorations suggérées ci-dessus. Il représente une base solide pour une application de gestion des ressources humaines moderne et efficace.

---

## Annexes

### Annexe A : Schéma de la Base de Données

[Diagramme ER ou description détaillée des relations entre les entités]

### Annexe B : Captures d'Écran

[Captures d'écran des principales pages de l'application]

### Annexe C : Extrait de Code

[Exemples de code significatifs du projet]

### Annexe D : Guide d'Installation

#### Prérequis
- Node.js (v18 ou supérieur)
- PostgreSQL (v14 ou supérieur)
- npm ou yarn

#### Installation Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement dans .env
npx prisma migrate dev
npm run dev
```

#### Installation Frontend
```bash
cd frontend
npm install
npm run dev
```

### Annexe E : Liste des Technologies

[Tableau récapitulatif des technologies utilisées avec leurs versions]

---

## Bibliographie

### Documentation Officielle

- React Documentation. https://react.dev/
- Node.js Documentation. https://nodejs.org/
- Express.js Documentation. https://expressjs.com/
- Prisma Documentation. https://www.prisma.io/docs
- PostgreSQL Documentation. https://www.postgresql.org/docs/
- TailwindCSS Documentation. https://tailwindcss.com/docs
- Socket.io Documentation. https://socket.io/docs/

### Ressources en Ligne

- MDN Web Docs. https://developer.mozilla.org/
- Stack Overflow. https://stackoverflow.com/
- GitHub. https://github.com/

### Livres et Articles

[Liste des livres et articles consultés si applicable]

---

**Fin du Rapport**

---

*Ce rapport a été rédigé dans le cadre d'un stage de développement réalisé à l'École Nationale d'Informatique (ENI) pour l'année académique 2024-2025.*

---

## Références des modèles (Annexe technique)

Les modèles demandés (MCD, MLD, dictionnaire de données, MCT, DFD/diagrammes de flux, liste des modèles Prisma) sont fournis dans le document :

- `DOCS_MODELES_GRH_CARSO.md`
