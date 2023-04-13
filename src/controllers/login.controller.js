import bcrypt from 'bcrypt'
import {pool} from '../database/conexion.js';

export const login = async(req, res)=>{
    const {correo, contraseña } = req.body;
    if(correo== null || contraseña == null){
        return res.status(400).json({
            mensaje: "llenar todos los campos",
          });
    }

    try {
        const usuario = await pool.query('SELECT * FROM cajero WHERE correo = $1', [correo]);

        if(bcrypt.compareSync(contraseña, usuario.rows[0].contraseña)){
            res.status(200).json({
                'mensaje': 'LOGIN SUCCES',
                "datos usuario": usuario.rows
            });
        }else{
            return res.status(404).json({
                'mensaje': 'CONTRASEÑA ACTUAL NO COINCIDE CON LA ALMACENADA EN LA BASE DE DATOS'
            });
        }
        
    } catch (error) {
        res.status(500).json({
            'mensaje': 'error interno 🚨📢🚩❌‼'
        });  
    }
}