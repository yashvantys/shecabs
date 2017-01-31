<div class="center-block">
	<div class="portlet-body">
		<div class="panel-group" id="accordion">
			<div class="panel panel-default">
				<div class="panel-heading panel-heading-custom"
					data-toggle="collapse" data-parent="#accordion"
					data-target="#collapseOne">
					<h6 class="panel-title pane-title-custom">
						<a class="accordion-toggle"> <b>Driver Management</b>
						</a>
					</h6>

				</div>

			</div>
		</div>
	</div>
</div>
<div class="portlet box center-block">
    <div class="pull-right dt-buttons btn-overlap btn-group"><a href="#modal-form" data-toggle="modal" class="dt-button buttons-collection buttons-colvis btn btn-white btn-primary btn-bold" tabindex="0" aria-controls="dynamic-table" data-original-title="" title="">Add Driver<span> </span></a></div></div>
	<div id="ajaxResults"></div>
	<table class="table table-striped table-bordered table-hover dataTable no-footer drivers-list" id="dynamic-table">
		<thead>
			
			<tr>
				<th>Email</th>
                                <th>Name</th>
                                <th>DOB</th>
                                <th>Mobile</th>
                                <th>vehicleNo</th>
                                <th>Status</th>
				
			</tr>
		</thead>
		<tbody class="defaultprogress"></tbody>
	</table>

</div>





										
										<div id="modal-form" class="modal" tabindex="-1">
									<div class="modal-dialog">
									<form method="post" action="<?php echo base_url('drivers/add');?>">
										<div class="modal-content">
											<div class="modal-header">
												<button type="button" class="close" data-dismiss="modal">&times;</button>
												<h4 class="blue bigger">Drivers Add/Edit</h4>
											</div>

											<div class="modal-body">
											
												<div class="row">
													

													<div class="col-xs-12 col-sm-7 col-md-10">
													
														<div class="form-group col-md-6">
															<label for="form-field-first">First Name</label>
															<div>
																<input type="text" id="form-field-first" placeholder="First Name" value="" name="firstname" />
															</div>
														</div>
															<div class="form-group col-md-6">
															<label for="form-field-first">Last Name</label>
															<div>
																<input type="text" id="form-field-first" placeholder="Last Name" value="" name="lastname" />
															</div>
														</div>
															<div class="form-group col-md-6">
															<label for="form-field-first">Email</label>
															<div>
																<input type="text" id="form-field-first" placeholder="Email" value="" name="email" />
															</div>
														</div>
														<div class="form-group col-md-6">
															<label for="form-field-first">Password</label>
															<div>
																<input type="password" id="form-field-first"  value="" name="password" />
															</div>
														</div>
														<div class="form-group col-md-6">
															<label for="form-field-first">Mobile</label>
															<div>
																<input type="text" id="form-field-first" placeholder="Mobile" value="" name="mobile" />
															</div>
														</div>
														<div class="form-group col-md-6">
															<label for="form-field-first">VehicleNo</label>
															<div>
																<input type="text" id="form-field-first" placeholder="VehicleNo" value="" name="vehicleNo" />
															</div>
														</div>
														
														<div class="form-group col-md-6">
															<label for="form-field-first">Gender</label>
															<div>
																<select class="form-control" id="gender" name="gender">
																<option value="1">Male</option>
																<option value="2">Female</option></select>
																
															</div>
														</div>
														
														<div class="form-group col-md-6">
															<label for="form-field-first">Cab Type</label>
															<div>
																<select class="form-control" id="gender" name="cabtype">
																<option value="1">Mini</option>
																<option value="2">Sedan</option></select>
																
															</div>
														</div>
														<div class="form-group col-md-6">
															<label for="form-field-first">LicenseId</label>
															<div>
																<input type="text" id="form-field-first" placeholder="LicenseId" value="" name="licenseId" />
															</div>
														</div>
														<div class="form-group col-md-6">
															<label for="form-field-first">Location</label>
															<div>
																<input type="text" id="form-field-first" placeholder="Location" value="" name="location" />
															</div>
														</div>
														<div class="form-group col-md-6">
															<label for="form-field-first">DOB</label>
															<div>
																<input type="text" id="form-field-mask-1" class="form-control input-mask-date" placeholder="DOB" value="" name="dob" />
															</div>
														</div>
														
													</div>
												</div>
												
											</div>

											<div class="modal-footer">
												<button class="btn btn-sm" data-dismiss="modal">
													<i class="ace-icon fa fa-times"></i>
													Cancel
												</button>

												<button type="submit" class="btn btn-sm btn-primary">
													<i class="ace-icon fa fa-check"></i>
													Save
												</button>
											</div>
										</div></form>
									</div>
								</div><!-- PAGE CONTENT ENDS -->