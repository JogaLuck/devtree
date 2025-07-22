import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    handle: string;
    name: string;
    email: string;
    password: string;
    description: string;
    image: string;
    links: string;
    // Campos virtuales para contadores
    followersCount?: number;
    followingCount?: number;
}

const userSchema = new Schema({
    handle: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    links: {
        type: String,
        default: '[]'
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});


userSchema.virtual('followersCount', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'following',
  count: true
});

userSchema.virtual('followingCount', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'follower',
  count: true
});


userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model<IUser>('User', userSchema);
export default User;