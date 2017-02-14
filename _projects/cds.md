---
title: Climatology Data Service
thumb: "assets/cds-thumb.png"
layout: project
order: '4'
category: "ongoing"
---
<div class="container">
    <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title">Climatology Data Service</h4>
        </div>
        <div class="modal-body">
          <div class='row'>
            <div class ='col-sm-6'>
            <img src="../assets/cds-thumb.png" id='cds-thumb'/>
            </div>
            <div class='col-sm-6'>
              <h4 class='text-muted page-header' align="center">Project Description</h4>

              <p>This is an ongoing project of mine to efficiently serve climate model output for arbitrary geometries in space and time. In basic terms, I ingest climate model data (from big general circulation models) into a database, then provide a RESTful API so that users can query specific parts of the data, rather than downloading entire rasters. There are several particularly challenging aspects that make this one of my favorite projects to work on. First, climate model data is both spatial and temporal, making database modeling difficult. Second, climate models have a lot of variables, and finding a general data model that describes them yet works as a relational table structure is tricky. Finally, it's big -- there's a lot of data going to and from the server so figuring out what's important and what can be dropped from the response is critical to improve latency.
                </p>

              <h4 class='text-muted page-header' align='center'>Tools Used</h4>
              <ul>
                <li class='no-bullet'>PostgreSQL / POSTGIS</li>
                <li class='no-bullet'>Node.js</li>
                <li class='no-bullet'>Swagger</li>
              </ul>
              <h4 class='text-muted page-header'><a href='http://grad.geography.wisc.edu/cds'>Working Demo</a> </h4>
            </div>
          </div>
</div>
