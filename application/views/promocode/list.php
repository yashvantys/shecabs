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

<div class="portlet box center-block">
    <div class="pull-right dt-buttons btn-overlap btn-group"><a href="#modal-form" data-toggle="modal" class="dt-button buttons-collection buttons-colvis btn btn-white btn-primary btn-bold" tabindex="0" aria-controls="dynamic-table" data-original-title="" title="">Add Promocode<span> </span></a></div></div>
	<div id="ajaxResults"></div>
	<table class="table table-striped table-bordered table-hover dataTable no-footer promocode-list" id="dynamic-table">
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
		<tbody class="defaultprogress"></tbody>
	</table>

</div>



										
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