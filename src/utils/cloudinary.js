import path  from 'path'
import dotenv from 'dotenv'
dotenv.config({path:path.resolve('./config/.env')})
import cloudinary from 'cloudinary'


cloudinary.config({
    cloud_name: 'dkptjzf2m',
    api_key: 837555644756217
    ,
    api_secret:'zsKhmAM0c0qm8A7vR21Wt0u8_XM'
})

export default cloudinary.v2