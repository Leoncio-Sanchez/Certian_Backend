"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitadoController = void 0;
const invitado_service_1 = require("../services/invitado.service");
const invitadoService = new invitado_service_1.InvitadoService();
class InvitadoController {
    async getWelcome(req, res) {
        try {
            const featuredCompanies = await invitadoService.getAliasedCompanies();
            res.status(200).json({
                status: 'success',
                message: 'Bienvenido al módulo de Invitado.',
                data: {
                    availableFeatures: [
                        'Ver desafíos públicos',
                        'Explorar empresas aliadas',
                        'Información sobre la plataforma'
                    ],
                    featuredCompanies
                }
            });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getPublicChallenges(req, res) {
        try {
            const challenges = await invitadoService.getPublicChallenges();
            res.status(200).json({
                status: 'success',
                data: challenges
            });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}
exports.InvitadoController = InvitadoController;
