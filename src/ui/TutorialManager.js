export class TutorialManager {
    static getTips(levelId) {
        const tips = {
            1: "Bienvenue ! Utilise ⬆️MOVE pour atteindre la banane.",
            2: "Tu peux utiliser 🔁REPEAT pour éviter de répéter 10 fois la même commande.",
            3: "Attention au crocodile ! Utilise 🦘JUMP pour sauter par-dessus s'il bloque le chemin.",
            4: "La tortue est ton amie. Elle peut te servir de pont sur l'eau.",
            5: "Les boucles peuvent être imbriquées ! Une boucle dans une boucle.",
            6: "Observe bien le rythme des crocodiles pour passer au bon moment.",
            7: "Les tortues bougent parfois. Calcule bien ton timing.",
            8: "Utilise ♾️WHILE pour ramasser toutes les bananes sans compter les pas !",
            9: "N'oublie pas de tourner ⬅️ ou ➡️ avant d'avancer.",
            10: "C'est l'épreuve finale. Utilise tout ce que tu as appris !"
        };
        return tips[levelId] || "Bonne chance !";
    }
}
