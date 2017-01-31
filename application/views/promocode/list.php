<div class="center-block">
	<div class="portlet-body">
		<div class="panel-group" id="accordion">
			<div class="panel panel-default">
				<div class="panel-heading panel-heading-custom"
					data-toggle="collapse" data-parent="#accordion"
					data-target="#collapseOne">
					<h6 class="panel-title pane-title-custom">
						<a class="accordion-toggle"> <b>Promocode Management</b>
						</a>
					</h6>

				</div>

			</div>
		</div>
	</div>
</div>
<div class="pull-right tableTools-container">
<div class="dt-buttons btn-overlap btn-group"><a href="#modal-form" data-toggle="modal" class="dt-button buttons-collection buttons-colvis btn btn-white btn-primary btn-bold" tabindex="0" aria-controls="dynamic-table" data-original-title="" title="">Create Promocode<span> </span></a></div></div>
<table id="simple-table" class="table  table-bordered table-hover">
											<thead>
												<tr>
													
												
													<th>Code</th>
													<th>Calculation</th>
													<th>Discount</th>
													<th>Count</th>
                                                    <th>MinCostValue</th>
													<th>Start</th>
													<th>End</th>
													<th>Status</th>
												</tr>
											</thead>

											<tbody>
											<?php 
											
											foreach ($promocodelist->result as $promocodelist){
											?>
												<tr>
													
													
													<td><?php echo $promocodelist->code;?></td>
													<td><?php echo $promocodelist->calculation;?></td>
													<td ><?php echo $promocodelist->discount;?></td>
													<td><?php echo $promocodelist->count;?></td>
													<td><?php echo $promocodelist->minCostValue;?></td>
													<td><?php echo $promocodelist->startTimeVal;?></td>
													<td><?php echo $promocodelist->endTimeVal;?></td>
													
													<td><a href="#modal-form" data-toggle="modal" class="tooltip-success" data-rel="tooltip" title="Edit">
																			<span class="green">
																				<i class="ace-icon fa fa-pencil-square-o bigger-120"></i>
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
									<form method="post" action="<?php echo base_url('promocode/add');?>">
										<div class="modal-content">
											<div class="modal-header">
												<button type="button" class="close" data-dismiss="modal">&times;</button>
												<h4 class="blue bigger">Promocode Create/Update</h4>
											</div>

											<div class="modal-body">
											
												<div class="row">
													

													<div class="col-xs-12 col-sm-7 col-md-10">
													
														<div class="form-group col-md-6">
															<label for="form-field-first">Code</label>
															<div>
																<input type="text" class="form-control " placeholder="Code" value="" name="code" />
															</div>
														</div>
															
														
														<div class="form-group col-md-6">
															<label for="form-field-first">Calculation</label>
															<div>
																<select class="form-control" id="calculation" name="calculation">
																<option value="-">-</option>
																<option value="%">%</option></select>
																
															</div>
														</div>
														
														
														<div class="form-group col-md-6">
															<label for="form-field-first">Discount</label>
															<div>
																<input type="text" class="form-control " placeholder="Discount" value="" name="discount" />
															</div>
														</div>
														<div class="form-group col-md-6">
															<label for="form-field-first">Count</label>
															<div>
																<input type="text" class="form-control "  placeholder="Count" value="" name="count" />
															</div>
														</div>
														<div class="form-group col-md-6">
															<label for="form-field-first">Min Cost Value</label>
															<div>
																<input type="text"  class="form-control " placeholder="MinCostValue" value="" name="minCostValue" />
															</div>
														</div>
														<div class="form-group col-md-6">
															<label for="form-field-first">Start Time</label>
															<div>
																<input type="text" class="form-control " placeholder="startTime" value="" name="startTime" />
															</div>
														</div>
														<div class="form-group col-md-6">
															<label for="form-field-first">End Time</label>
															<div>
																<input type="text"  class="form-control " placeholder="endTime" value="" name="endTime" />
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