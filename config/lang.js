'use strict'

const lang = {
	common: {
		time: {
			seconds: {
				en: `Segundos`,
				es: `Segundos`
			}
		},
		request: {
			completed: {
				id: `R_COMPLETED`,
				en: `The request was attended`,
				es: `La solicitud fue atendida`
			},
			updCompleted: {
				id: `R_UPDCOMPLETE`,
				en: `Request was completed, the item was successfully updated`,
				es: `La solicitud ha sido atendida, el registro se actualizo exitosamente`
			},
			uncompleted: {
				id: `R_UNCOMPLETE`,
				en: `Request was not fully processed, verify the info and retry`,
				es: `La solicitud fue atendida a medias, verifica la informacion y reintenta de ser necesario`
			},
			failedTryAgain: {
				id: `R_FAILED_TRYAGAIN`,
				en: `Request was not processed, try again`,
				es: `La solicitud no ha podido ser atendida, intentalo nuevamente`
			},
			failedTryAgainSupport: {
				id: `R_FAILED_TRYAGAINSUPPORT`,
				en: `Request uncompleted, try again and if you keep viewing this message, look for support`,
				es: `La solicitud no ha podido ser atendida, intentalo nuevamente, si el problema persiste, comunicate con soporte`
			},
			failedTryAgainValidate: {
				id: `R_FAILED_TRYAGAINVALIDATE`,
				en: `Request uncompleted, check the information and try again`,
				es: `La solicitud no ha podido ser atendida, valida la informacion ingresada e intentalo nuevamente`
			},
			failedAlreadyExists: {
				id: `R_FAILED_ALREADYEXISTS`,
				en: `Request uncompleted, there is already an item with the same information`,
				es: `La solicitud no ha podido ser atendida, ya existe otro registro con la misma informacion`
			},
			failedIdNotFound: {
				id: `R_FAILED_IDNOTFOUND`,
				en: `Request uncompleted, ID {id} was not found on database`,
				es: `La solicitud no ha podido ser atendida, el ID {id} no fue encontrado en la base de datos`
			},
			failedDismiss: {
				id: `R_FAILED_DISMISS`,
				en: `There was a problem with the request, process cannot continue`,
				es: `Hubo un problema con la solicitud, no se puede continuar con el proceso`
			}
		},
		externalEndpoint: {
			failedRequest: {
				id: `R_E_FAYLED_REQUEST`,
				en: `Hubo un problema con la solicitud/conexion con el endpoint: {end}, funcion: {fun}, revisar el detalle en el log`,
				es: `Hubo un problema con la solicitud/conexion con el endpoint: {end}, funcion: {fun}, revisar el detalle en el log`,
			}
		},
		file: {
			failedBadExtension: {
				id: `R_F_FAYLEDBADEXTENSION`,
				en: `There was a problem with the request, file does not have a valid extension, ({fileName})`,
				es: `Hubo un problema con la solicitud, el archivo no tiene una extension valida, ({fileName})`
			}
		}
	}
};

export default lang;
