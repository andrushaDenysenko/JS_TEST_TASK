const schem = require('./schema')

const get_random_obj_based_on_schema = (inputschema) =>{
	try{
		const get_random_bool = () => Math.random() > 0.5 || false
		const get_random_from_array = (array) => array[Math.floor(Math.random() * array.length)]
		const get_random_int = (min=0, max=10) => {const int = Math.floor(Math.random()*max); return int >= min ? int : min}  
		const get_random_str = (length=10, charset = 'abcdefghijklmnopqrstuvwxyz0123456789') => {
			const result = [];
				for(let i = 0; i < length; i++) {
					result.push(charset.charAt(Math.floor(Math.random() * charset.length)));
				};
			return result.join('');
		}
		const get_random_str_from_regex = (regex=null) => {
			if(regex?.length){
				try {
					return regex.replace(/\\/ig, '').split('/')
						.map(e=> {
								e = e.replace('[a-z]+', get_random_str(5));
								e = e.replace('[0-9]+', get_random_int(0, 10))
								e = e.replace('[0-9a-zA-Z]+', get_random_str(10))
							return e 
						}).join('/')
				} catch (error) { console.log(error.message); return '' }
			}else{
				return get_random_str(10)
			}
		}


		
		const get_data_by_type = (val) =>{
			let result = null;
			switch (val.type) {
				case 'string':
					if(val.format == 'regex'){
						result = get_random_str_from_regex(val.pattern)
						break
					}else{
						result = get_random_str(10)
						break
					}
				case 'integer':
					result = get_random_int(val.minimum, val.maximum)
					break
				case 'null':
					result =null;
					break
				case 'boolean':	
					result = get_random_bool(); 
					break
				case 'object':
					result = {};
					break
				case 'array':
					result = []
					if(val.items) {
						if(inputschema.definitions){
							let items = Object.values(inputschema.definitions).find(def => def.$id == val.items.$ref)
							result = [get_obj(items)]
						}
					}
					if(val.default) {
						result = get_random_bool() ? val.default : result; 
					}
					break
				default:
					break;
			}
			return result
		}
		const get_random_data_based_val = (val) =>{
				let value = null
				Object.keys(val).forEach(key => {
					if(key == 'type') value = get_data_by_type(val)
					if(key == 'anyOf') {
						let anyOf_item = get_random_from_array(val.anyOf)
						value = get_random_data_based_val(anyOf_item)
					}
					if(key == 'enum') value = get_random_from_array(val.enum)
			});
			return value
		}
		const get_obj = (schema, required=[]) => {
			if(schema.properties) return get_obj(schema.properties, schema.required)
			let body = {}
			Object.keys(schema).forEach(key => {
				if(schema[key]?.properties) {body[key] = get_obj(schema[key].properties, schema[key].required)}
				else {
					if(required.find(field => field == key)){
						body[key] = get_random_data_based_val(schema[key])
					}else{
						if(get_random_bool()) body[key] = get_random_data_based_val(schema[key])
					}
				} 
			})	
			return body	
		}
		let result = get_obj(inputschema)
		return result
	} catch (error) {
		return error.message
	}
}
module.exports ={
	get_random_obj_based_on_schema
}