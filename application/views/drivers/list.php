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
<div class="pull-right tableTools-container">
<div class="dt-buttons btn-overlap btn-group"><a href="#modal-form" data-toggle="modal" class="dt-button buttons-collection buttons-colvis btn btn-white btn-primary btn-bold" tabindex="0" aria-controls="dynamic-table" data-original-title="" title="">Add Driver<span> </span></a></div></div>
<table id="simple-table" class="table  table-bordered table-hover">
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

											<tbody>
											<?php 
											
											foreach ($driverslist->result as $driverslist){
											?>
												<tr>
													
													
													<td><?php echo $driverslist->email;?></td>
													<td><?php echo $driverslist->firstName." ".$driverslist->lastName;?></td>
													<td ><?php echo $driverslist->dob;?></td>
													<td><?php echo $driverslist->mobileNo;?></td>
													<td><?php echo $driverslist->vehicleNo;?></td>
													
													<td>
													
													<a href="#" class="tooltip-success" data-rel="tooltip" title="Edit">
																			<span class="green">
																				<i class="ace-icon fa fa-pencil-square-o bigger-120"></i>
																			</span>
																		</a>&nbsp;&nbsp;&nbsp;
																		<a href="#" class="tooltip-error" data-rel="tooltip" title="Delete">
																			<span class="red">
																				<i class="ace-icon fa fa-trash-o bigger-120"></i>
																			</span>
																		</a>
																		</td>

												

													
												</tr>
                                           <?php }?>
												

												<tr class="detail-row">
													<td colspan="8">
														<div class="table-detail">
															<div class="row">
																<div class="col-xs-12 col-sm-2">
																	<div class="text-center">
																		<img height="150" class="thumbnail inline no-margin-bottom" alt="Domain Owner's Avatar" src="assets/images/avatars/profile-pic.jpg" />
																		<br />
																		<div class="width-80 label label-info label-xlg arrowed-in arrowed-in-right">
																			<div class="inline position-relative">
																				<a class="user-title-label" href="#">
																					<i class="ace-icon fa fa-circle light-green"></i>
																					&nbsp;
																					<span class="white">Alex M. Doe</span>
																				</a>
																			</div>
																		</div>
																	</div>
																</div>

																<div class="col-xs-12 col-sm-7">
																	<div class="space visible-xs"></div>

																	<div class="profile-user-info profile-user-info-striped">
																		<div class="profile-info-row">
																			<div class="profile-info-name"> Username </div>

																			<div class="profile-info-value">
																				<span>alexdoe</span>
																			</div>
																		</div>

																		<div class="profile-info-row">
																			<div class="profile-info-name"> Location </div>

																			<div class="profile-info-value">
																				<i class="fa fa-map-marker light-orange bigger-110"></i>
																				<span>Netherlands, Amsterdam</span>
																			</div>
																		</div>

																		<div class="profile-info-row">
																			<div class="profile-info-name"> Age </div>

																			<div class="profile-info-value">
																				<span>38</span>
																			</div>
																		</div>

																		<div class="profile-info-row">
																			<div class="profile-info-name"> Joined </div>

																			<div class="profile-info-value">
																				<span>2010/06/20</span>
																			</div>
																		</div>

																		<div class="profile-info-row">
																			<div class="profile-info-name"> Last Online </div>

																			<div class="profile-info-value">
																				<span>3 hours ago</span>
																			</div>
																		</div>

																		<div class="profile-info-row">
																			<div class="profile-info-name"> About Me </div>

																			<div class="profile-info-value">
																				<span>Bio</span>
																			</div>
																		</div>
																	</div>
																</div>

																<div class="col-xs-12 col-sm-3">
																	<div class="space visible-xs"></div>
																	<h4 class="header blue lighter less-margin">Send a message to Alex</h4>

																	<div class="space-6"></div>

																	<form>
																		<fieldset>
																			<textarea class="width-100" resize="none" placeholder="Type something…"></textarea>
																		</fieldset>

																		<div class="hr hr-dotted"></div>

																		<div class="clearfix">
																			<label class="pull-left">
																				<input type="checkbox" class="ace" />
																				<span class="lbl"> Email me a copy</span>
																			</label>

																			<button class="pull-right btn btn-sm btn-primary btn-white btn-round" type="button">
																				Submit
																				<i class="ace-icon fa fa-arrow-right icon-on-right bigger-110"></i>
																			</button>
																		</div>
																	</form>
																</div>
															</div>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
										
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