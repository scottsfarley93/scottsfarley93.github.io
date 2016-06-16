---
layout: post
title:  "Creating the Niche API"
date:   2016-07-14 9:22:52 -0500
categories: Research Visualization
---

## Documentation for API Endpoints

All URIs are relative to *http://niche.geography.wisc.edu/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AveragingTypesApi* | [**averaging_types_averaging_type_id_delete**](docs/AveragingTypesApi.md#averaging_types_averaging_type_id_delete) | **DELETE** /averagingTypes/{averagingTypeID} | Delete an averaging type using its averagingTypeID
*AveragingTypesApi* | [**averaging_types_averaging_type_id_get**](docs/AveragingTypesApi.md#averaging_types_averaging_type_id_get) | **GET** /averagingTypes/{averagingTypeID} | Get details about a specific averaging type using its averagingTypeID
*AveragingTypesApi* | [**averaging_types_averaging_type_id_put**](docs/AveragingTypesApi.md#averaging_types_averaging_type_id_put) | **PUT** /averagingTypes/{averagingTypeID} | Update details of a specific averaging type using its averagingTypeID
*AveragingTypesApi* | [**averaging_types_get**](docs/AveragingTypesApi.md#averaging_types_get) | **GET** /averagingTypes | Get a list of the averaging types in the database
*AveragingTypesApi* | [**averaging_types_post**](docs/AveragingTypesApi.md#averaging_types_post) | **POST** /averagingTypes | Add a new averaging period to the database
*DataApi* | [**data_get**](docs/DataApi.md#data_get) | **GET** /data | Get the value of one or more layers at a space-time location
*LayersApi* | [**layers_get**](docs/LayersApi.md#layers_get) | **GET** /layers | Get a list of the layers in the database
*LayersApi* | [**layers_layer_id_delete**](docs/LayersApi.md#layers_layer_id_delete) | **DELETE** /layers/{layerID} | Delete a layer and its raster table using its layerID
*LayersApi* | [**layers_layer_id_get**](docs/LayersApi.md#layers_layer_id_get) | **GET** /layers/{layerID} | Get details about a specific layer using its layerID
*LayersApi* | [**layers_layer_id_put**](docs/LayersApi.md#layers_layer_id_put) | **PUT** /layers/{layerID} | Update a layer&#39;s details using its layerID
*LayersApi* | [**layers_post**](docs/LayersApi.md#layers_post) | **POST** /layers | Add a layer to the databases
*SourcesApi* | [**sources_get**](docs/SourcesApi.md#sources_get) | **GET** /sources | Get a list of the data sources and models in the database
*SourcesApi* | [**sources_post**](docs/SourcesApi.md#sources_post) | **POST** /sources | Add a new source to the database.
*SourcesApi* | [**sources_source_id_delete**](docs/SourcesApi.md#sources_source_id_delete) | **DELETE** /sources/{sourceID} | Delete a source using its souce id
*SourcesApi* | [**sources_source_id_get**](docs/SourcesApi.md#sources_source_id_get) | **GET** /sources/{sourceID} | Get details about an specific source using its sourceID
*SourcesApi* | [**sources_source_id_put**](docs/SourcesApi.md#sources_source_id_put) | **PUT** /sources/{sourceID} | Update details about a specific source using its sourceID
*UnitsApi* | [**variable_units_get**](docs/UnitsApi.md#variable_units_get) | **GET** /variableUnits | Get a list of variable units in the database
*UnitsApi* | [**variable_units_post**](docs/UnitsApi.md#variable_units_post) | **POST** /variableUnits | Add a new variable unit to the database
*UnitsApi* | [**variable_units_variable_unit_id_delete**](docs/UnitsApi.md#variable_units_variable_unit_id_delete) | **DELETE** /variableUnits/{variableUnitID} | Delete a variable unit using its database id
*UnitsApi* | [**variable_units_variable_unit_id_get**](docs/UnitsApi.md#variable_units_variable_unit_id_get) | **GET** /variableUnits/{variableUnitID} | Get details about a specific variable unit instance
*UnitsApi* | [**variable_units_variable_unit_id_put**](docs/UnitsApi.md#variable_units_variable_unit_id_put) | **PUT** /variableUnits/{variableUnitID} |
*VariablePeriodsApi* | [**variable_period_types_get**](docs/VariablePeriodsApi.md#variable_period_types_get) | **GET** /variablePeriodTypes | Get a list of the variable period types in the database.
*VariablePeriodsApi* | [**variable_period_types_post**](docs/VariablePeriodsApi.md#variable_period_types_post) | **POST** /variablePeriodTypes | Add a new variable period type to the database
*VariablePeriodsApi* | [**variable_period_types_variable_period_type_id_delete**](docs/VariablePeriodsApi.md#variable_period_types_variable_period_type_id_delete) | **DELETE** /variablePeriodTypes/{variablePeriodTypeID} | Delete an variable period instance using its variablePeriodTypeID
*VariablePeriodsApi* | [**variable_period_types_variable_period_type_id_get**](docs/VariablePeriodsApi.md#variable_period_types_variable_period_type_id_get) | **GET** /variablePeriodTypes/{variablePeriodTypeID} | Get a details about a specific variable period type using its variablePeriodTypeID.
*VariablePeriodsApi* | [**variable_period_types_variable_period_type_id_put**](docs/VariablePeriodsApi.md#variable_period_types_variable_period_type_id_put) | **PUT** /variablePeriodTypes/{variablePeriodTypeID} | Update the details of a specific variable period using its variablePeriodTypeID
*VariableTypesApi* | [**variable_types_get**](docs/VariableTypesApi.md#variable_types_get) | **GET** /variableTypes | Get a list of variable types in the database.
*VariableTypesApi* | [**variable_types_post**](docs/VariableTypesApi.md#variable_types_post) | **POST** /variableTypes | Add a new variable type to the database
*VariableTypesApi* | [**variable_types_variable_type_id_delete**](docs/VariableTypesApi.md#variable_types_variable_type_id_delete) | **DELETE** /variableTypes/{variableTypeID} | Delete a variable type instance using its variableID
*VariableTypesApi* | [**variable_types_variable_type_id_get**](docs/VariableTypesApi.md#variable_types_variable_type_id_get) | **GET** /variableTypes/{variableTypeID} | Get details about a specific variable type
*VariableTypesApi* | [**variable_types_variable_type_id_put**](docs/VariableTypesApi.md#variable_types_variable_type_id_put) | **PUT** /variableTypes/{variableTypeID} | Update details about a specific variable type in the database
*VariablesApi* | [**variables_get**](docs/VariablesApi.md#variables_get) | **GET** /variables | List Niche Variables
*VariablesApi* | [**variables_post**](docs/VariablesApi.md#variables_post) | **POST** /variables | Add a new niche variable
*VariablesApi* | [**variables_variable_id_delete**](docs/VariablesApi.md#variables_variable_id_delete) | **DELETE** /variables/{variableID} |
*VariablesApi* | [**variables_variable_id_get**](docs/VariablesApi.md#variables_variable_id_get) | **GET** /variables/{variableID} | Get details about a specific variable
*VariablesApi* | [**variables_variable_id_put**](docs/VariablesApi.md#variables_variable_id_put) | **PUT** /variables/{variableID} |
