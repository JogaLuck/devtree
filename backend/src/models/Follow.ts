import mongoose, { Schema, Document } from 'mongoose';

export interface IFollow extends Document {
    follower: mongoose.Types.ObjectId;
    following: mongoose.Types.ObjectId;
    createdAt: Date;
}

const followSchema = new Schema({
    // Usuario que sigue a otro
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Usuario que es seguido
    following: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Fecha cuando se creó la relación de seguimiento
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índice compuesto para evitar seguimientos duplicados y optimizar consultas
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Índices individuales para consultas rápidas
followSchema.index({ follower: 1 });
followSchema.index({ following: 1 });

const Follow = mongoose.model<IFollow>('Follow', followSchema);
export default Follow;